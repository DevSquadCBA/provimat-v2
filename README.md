[![backend-status](https://github.com/DevSquadCBA/bff-sip-v2/actions/workflows/deploy_aws_prod.yml/badge.svg?event=check_run)](https://github.com/DevSquadCBA/bff-sip-v2/actions/workflows/deploy_aws_prod.yml)

# Piatti SIP front end
Este proyecto funciona con vite. <br>
Para el despliegue, se utiliza CloudFront<br>
Se buildea la aplicación en un dist, y ésto es lo que se sube a un s3. Luego se enlaza cloudfront a ese bucket de s3 para servir la app como PWA. <br>


## Prerequisitos
- Es necesario que primero tengas desplegado y configurado el backend: [bff-sip-v2](https://github.com/DevSquadCBA/bff-sip-v2). <br>
- Un certificado con dominio configurado (se despliega con el backend)

## Configuración
Configura tu .env para que apunte al bff-sip-v2.<br>

## Modificación de archivos
El archivo serverless.yml, contiene la configuración del despliegue a AWS.<br>
El archivo .github\workflows\prod.yml, contiene la configuración para github para hacer el despliegue<br>
<br>
En el archivo prod.yml, no es necesario hacer cambios. Pero he dejado comentarios de como hacer un sed (comando de linux) para cambiar el archivo mientras se despliega. <br>
<br>

### Modificación de serverless.yml
En el archivo serverless.yml modificar:<br>
```yml
custom:
  bucketName: ${self:custom.stage}-"nombreBucket" # Éste será el nombre de tu bucket. Elije uno único en todo aws
  domainName: "" # Tu dominio, www.exaple.com
```
Lo otro a configurar es el certificado que generaste con el backend<br>
Copia el ARN del certificado y pegalo en el serverless.yml:<br>
```yml
resources:
  Resources:
    CloudFrontDistribution:
      Properties:
        DistributionConfig:
          ViewerCertificate:
            AcmCertificateArn: "arn:ws:acm:us-east-1:12345678:certifcate/111aaa-22bb-33cc-44444cccc" # cambia aquí por tu certficado
```

## Despliegue manual
Ejecuta
```bash
yarn build
```
Esto generará tu proyecto en /dist para poder ser llevado a una web. <br>
Aquí puede usar nginx, apache o el sistema que prefieras para apuntar al index.html. 

## Ejecución en local
Ejecuta
```bash
yarn run dev
```
