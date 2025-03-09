import { IClient,  ISale } from "@/interfaces/dbModels";
import { ErrorResponse } from "@/interfaces/Errors";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { formatPrice, getUserData, removeToken } from "@/services/common";
import moment from "moment";
import { Chart } from "primereact/chart";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import productIcon from '@/assets/products.svg';
import truckIcon from '@/assets/logoproovedores.svg';
import salesIcon from '@/assets/sidebar/logopresupuestos.svg';
import './HomeComponent.scss';
type Metrics ={
    mostDemandProducts: {productName:string,total_quantity:number}[],
    nextDeliverySales: (ISale & {client:IClient})[],
    salesGraph: {month:string,total:string}[]
}
type MetricsFormatted = {
    mostDemandProducts: {productName:string,total_quantity:number}[],
    nextDeliverySales: NextSalesGroupedByDay[],
    salesGraph: SalesGraph
}
type SalesGraph = {
    year: number;
    months: {
      month: string;
      total: number;
    }[];
}[];

type NextSalesGroupedByDay={
    day: string;
    sales: (ISale & {client:IClient})[]
}



export function HomeComponent(){
    const colorByYear= (year: 2024|2025) => {
        const colors = {
            2024: '#4CB3A099',
            2025: '#1F5D53'
        }
        return colors[year];
    }
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState<MetricsFormatted|null>(null);
    useEffect(()=>{
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate("/");
                    return;
                }
                const metricResponse:Metrics = await API.Metric.home(userData.token);
                const metricsFormatted: MetricsFormatted = {
                    mostDemandProducts: metricResponse?.mostDemandProducts,
                    nextDeliverySales: metricResponse.nextDeliverySales?.reduce((acc:NextSalesGroupedByDay[],sale:(ISale & {client:IClient}))=>{
                        const day = moment(sale.deadline).format('MM-DD');
                        const index = acc.findIndex(a=>a.day===day);
                        if(index!==-1){
                            const found = acc[index];
                            found.sales.push(sale);
                            acc[index] = found;
                            return acc;
                        }else{
                            acc.push({day: day,sales:[sale]});
                            return acc;
                        }
                    },[]),
                    salesGraph: metricResponse.salesGraph?.reduce((acc:SalesGraph,month:{month:string,total:string})=>{
                            if(!acc)acc=[];
                            const year = parseInt(month.month.replace(/(-[0-9]{2})$/,''));
                            const monthName = month.month.replace(/^[0-9]{4}-/,'');
                            const index = acc.findIndex(a=>a.year===year);
                            if(index!==-1){
                                const found = acc[index];
                                found.months.push({month: monthName, total: parseInt(month.total)});
                                acc[index] = found;
                                return acc;
                            }else{
                                acc.push({year: year,months:[{month: monthName, total: parseInt(month.total)}]});
                                return acc;
                            }
                    },[]) 
                }
                setMetrics(metricsFormatted);
          } catch (e) {
                if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                   // console.log(e);
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener las métricas", life: 3000 }));
                }
                console.error(e);
          }
        })();
    },[dispatch, navigate]) 

    return <>
        {!metrics &&
            <>
            <Skeleton className="mb-2 w-100"></Skeleton>
            <div className="flex flex_column h-full">
                <Skeleton className="mb-5 w-3" height="200px" borderRadius="16px"></Skeleton>
                <Skeleton className="mb-5 w-3" height="200px" borderRadius="16px"></Skeleton>
                <Skeleton className="mb-5 w-3" height="200px" borderRadius="16px"></Skeleton>
            </div>
            </>
        }
        {metrics &&
            <div className="home-container flex flex_row w-100 space-between text-left">
                <div className="next-deliveries-column">
                        <h3>Proximas entregas</h3>
                        <div className="closest-next-delivery">
                            <div className="truckIcon-container w-100">
                                <img src={truckIcon} className="truckIcon" alt="truck" />
                            </div>
                            <div className="closest-next-delivery-info w-100">
                                <p className="date">{moment(metrics.nextDeliverySales[0]?.day).format('DD/MM')}</p>
                                {metrics.nextDeliverySales[0]?.sales.slice(0,3).map(sale=>(
                                    <p className="clientName"><span>{sale.client.name}</span></p>
                                ))}
                                {metrics.nextDeliverySales[0]?.sales.length==3 
                                ? <p className="clientName">+1 cliente</p>
                                : metrics.nextDeliverySales[0]?.sales.length>3  
                                    ? <p className="clientName">+{metrics.nextDeliverySales[0]?.sales.length-2} clientes</p>
                                    :<></>}
                            </div>
                        </div>
                        <div className="next-deliveries">
                            {metrics.nextDeliverySales.slice(1,3).map(days=>(
                                <div className="next-delivery">
                                    <p className="date">{moment(days.sales[0].deadline).format('DD/MM')}</p>
                                    {days.sales.map(sale=>(
                                        <p className="clientName">{sale.client.name}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                </div>
                <div className="month-sales-column">
                        <h3>Ventas Mensuales</h3>
                        <div className="card">
                        <div className="month-sales w-100">
                            <Chart type="line" 
                                id="month-sales"
                                data={{
                                    labels:[...new Set(metrics.salesGraph.flatMap(year => year.months.map(month => month.month)))],
                                    datasets:
                                        metrics.salesGraph.map(year=>({
                                        type:'line',
                                        label:'Ventas de '+year.year,
                                        data: year.months.map(month => month.total),
                                        tension: 0.4,
                                        borderColor: colorByYear(year.year as 2024|2025)
                                    }))
                                }} 
                                options={{
                                    maintainAspectRatio: false,
                                    aspectRatio: 1.3,
                                    plugins: {
                                        tooltips: {
                                            mode: 'index',
                                            intersect: true
                                        },
                                        legend: {
                                            labels: {
                                                color: '#1F5D53'
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            stacked: true,
                                            ticks: {
                                                color: '#1F5D5350'
                                            },
                                            grid: {
                                                color: 'transparent'
                                            }
                                        },
                                        y: {
                                            stacked: false,
                                            ticks: {
                                                color: '#4CB3A050'
                                            },
                                            grid: {
                                                color: 'transparent'
                                            }
                                        }
                                    }
                                }} />
                        </div>
                        <div className="month-sales-legend">
                            <img src={salesIcon} alt="sales" />
                            <div className="month-sales-legends">
                                {metrics.salesGraph.map(year=>(
                                    <div className="month-sales-legend-item" style={{ color: colorByYear(year.year as 2024|2025) }}>
                                        <p>{year.year}</p>
                                        <p>${formatPrice(year.months.reduce((total, month) => total + month.total, 0))}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="products-with-hight-demand">
                    <h3>Productos con ALTA DEMANDA</h3>
                    <div className="products-with-hight-demand-info">
                        {metrics.mostDemandProducts.slice(0,5).map(product=>(
                            <div className="product-with-hight-demand">
                                <div className="product-with-hight-demand-icon">
                                    <div className="icon-container">
                                        <img src={productIcon} alt="product" />
                                    </div>
                                </div>
                                <div className="product-with-hight-demand-data">
                                    <div className="product-with-hight-demand-name">
                                        {product.productName}
                                    </div>
                                    <div className="product-with-hight-demand-quantity">
                                        {product.total_quantity}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        }
    </>
}