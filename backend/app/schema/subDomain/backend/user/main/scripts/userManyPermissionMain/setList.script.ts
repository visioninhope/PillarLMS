import makeSetList from "../../../../../../utils/engine/setList.engine";
import { d_sub } from "../../../../../../utils/types/dependencyInjection.types";
import { returningSuccessObj } from "../../../../../../utils/types/returningObjs.types";

type input = {
  id?: string
  userId: string
  permissionId: string
}

export default function setList({ subDomainDb, errorHandler, subDomainTransaction, loggers, }: d_sub) {
  const db = subDomainDb.models;

  return async (setArray: input[]): Promise<returningSuccessObj<null>> => {

    const setListEngine = makeSetList({ errorHandler, loggers, })

    const response = await setListEngine({
      setArray,
      dbEntity: db.backendUserManyPermission,
      transaction: subDomainTransaction,
      currentDbArray: await db.backendUserManyPermission.findAll({
        transaction: subDomainTransaction,
      })
    }).catch(error => errorHandler(error, loggers))

    return response
  }
}


