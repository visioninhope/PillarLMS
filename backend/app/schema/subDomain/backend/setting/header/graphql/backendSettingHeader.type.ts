import gql from "graphql-tag"

const backendSettingHeaderGraphQLType = gql`

  type BackendSettingHeaderRealTimeType {
    id: String,
    entity: String,
    webAssetImport: String,
    menuJsonB: String,
    userAnswersJsonB: String,
    isReady: RealTimeSwitch
  }

  type BackendSettingHeaderBuiltInType {
    id: String,
    webAssetImport: String,
    menuJsonB: String,
    description: String,
    author: String,
    authorLink: String,
    name: String,
  }

  type Query {
    backendSettingHeader_getOneRealTime(socketId: ID!): BackendSettingHeaderRealTimeType
    backendSettingHeaderBuiltIn_getMany:[BackendSettingHeaderBuiltInType]
  }
  type Mutation {
    backendSettingHeader_upsertOne(id: ID!, webAssetImport: String, menuJsonB: String, userAnswersJsonB: String, isReady: Boolean): GlobalSuccessType
  }
`

export default backendSettingHeaderGraphQLType