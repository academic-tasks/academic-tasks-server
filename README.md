# Sistema Academic Tasks

## Infraestrutura

| Serviço                                        | Descrição           | Plataforma      |
| ---------------------------------------------- | ------------------- | --------------- |
| [service-endpoint](services/service-endpoint/) | Camada de Servidor. | NestJS; node@18 |

| Serviço                                       | Descrição                              | Plataforma  |
| --------------------------------------------- | -------------------------------------- | ----------- |
| [service-database](services/service-database) | Banco de dados geral da aplicação.     | postgres@15 |
| [service-auth](services/service-auth)         | Plataforma de Autenticação OAuth/OIDC. | keycloak@19 |

<!--|                                           | [service-search](services/service-search) | Motor de indexação e busca. | meilisearch@v0.29 |  | -->
