import { Model } from "sequelize";
import { d_sub } from "../../../../../../../utils/types/dependencyInjection.types";
import { returningSuccessObj } from "../../../../../../../utils/types/returningObjs.types";
import backendSettingSite from "../../../../../../../../models/subDomain/backend/setting/backendSettingSite.model";

type input = {
  id?: string
  favicon?: string
  tab?: string
  isReady: boolean
}

export default function upsertOne({ subDomainDb, errorHandler, subDomainTransaction, loggers, }: d_sub) {
  const db = subDomainDb.models;

  return async (args: input): Promise<returningSuccessObj<Model<backendSettingSite> | null>> => {
    
    // Use upsert instead of separate create or update
    const [instance, created] = await db.backendSettingSite.upsert(args, {
      returning: true,
      transaction: subDomainTransaction,
    })
    // .catch(error => errorHandler(error, loggers))

    // `created` is a boolean indicating whether a new instance was created
    // `instance` is the model instance itself
    if (created) {
      // New instance created
      return {
        success: true,
        data: instance,
      }
    } else {
      // Existing instance updated
      return {
        success: true,
        data: instance,
      }
    }
  }
}
