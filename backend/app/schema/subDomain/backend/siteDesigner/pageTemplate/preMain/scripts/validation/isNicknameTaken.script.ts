import { d_sub } from "../../../../../../../utils/types/dependencyInjection.types";

type input = { nickname: string }

export default function isNicknameTaken({ subDomainDb, errorHandler, subDomainTransaction, loggers, }: d_sub) {

  const db = subDomainDb.models;

  return async (where: input) => {

    const data: number = await db.backendSiteDesigner_pageTemplate.count({
      where,
      transaction: subDomainTransaction,
    }).catch(error => errorHandler(error, loggers))


    return {
      success: true,
      result: data !== 0,
    }
  }
}


