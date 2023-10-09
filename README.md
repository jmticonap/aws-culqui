# aws-culqui
## Despliegue local

Ejecutar el comando de instalación de NPM dentro de la carpeta culqui

``` bash
$ cd culqui
$ npm i
$ cd ..
```

Ahora generamos el build y lo desplegamos en lambda

```bash
$ sam build
$ sam deploy --guided
```

Para correr el proyecto de forma local podemos ejecutar
```bash
$ sam local start-api
```

## Referencia del API

#### Save Card

```http
  POST /card
```

Request:
| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Requerido**. Email del propietario de la tarje |
| `card_number`      | `string` | **Requerido**. Numero de tarjeta |
| `cvv`      | `string` | **Requerido**. Numero de cvv de la tarje |
| `expiration_year`      | `string` | **Requerido**. Año de expiración de la tarje |
| `expiration_month`      | `string` | **Requerido**. Mes de expiración de la tarjeta |

Response:
| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `token`      | `string` | 16 caracteres de token. Este es valido por 1 minutos |

#### Get Card

```http
  GET /card?token={token}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **Requerido**. Token asociado a la tarjeta |

Response:
| Field | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`      | `string` | **Requerido**. Email del propietario de la tarje |
| `card_number`      | `string` | **Requerido**. Numero de tarjeta |
| `expiration_year`      | `string` | **Requerido**. Año de expiración de la tarje |
| `expiration_month`      | `string` | **Requerido**. Mes de expiración de la tarjeta |

# Postman
Para ejecutar los end-point podemos utilizar el archivo

```
culqi_challenge.postman_collection.json
```
![Postman](img/001.png)
Se deberá crear dos entornos (local, prod) con la variable "base_url"
- local: http:localhost:3000
- prod: 
https://qqg2ydzmoe.execute-api.us-east-2.amazonaws.com/Prod