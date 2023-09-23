import { Model } from "sequelize";
import { d_sub } from "../../../../../../utils/types/dependencyInjection.types";
import { returningSuccessObj } from "../../../../../../utils/types/returningObjs.types";
import backendNotification from "../../../../../../../models/subDomain/backend/notification/backendNotification.model";
import { notificationAction } from "./addOne.script";

type input = {
  id: string
  message?: string
  hasBeenSeen?: boolean
  hasBeenClicked?: boolean
  action?: notificationAction,
  userId?: string,  
}

export default function updateOne({ subDomainDb, errorHandler, subDomainTransaction, loggers, }: d_sub) {
  const db = subDomainDb.models;

  return async ({ id, ...args }: input): Promise<returningSuccessObj<Model<backendNotification>>> => {

    const data = await db.backendNotification.update(
      args,
      {
        where: { id, },
        returning: true,
        transaction: subDomainTransaction,
      }).catch(error => errorHandler(error, loggers))

    return {
      success: true,
      data: data[0] !== 0 ? data[1][0] : null,
    }
  }
}


