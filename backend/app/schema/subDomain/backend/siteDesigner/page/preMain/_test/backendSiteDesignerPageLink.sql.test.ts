import { dependencies } from "../../../../../../utils/dependencies/type/dependencyInjection.types";
import { makeDTestObj } from "../../../../../../utils/dependencies/makeTestDependency";
import makeBackendSiteDesignerPageMain from "../../main/backendSiteDesignerPage.main";
import makeBackendSiteDesignerPageLinkSql from "../backendSiteDesignerPageLink.sql";
jest.setTimeout(100000)


describe("test backendSiteDesignerPageLink.sql.js", () => {
  let d: dependencies
  let recordId: string
  let pageRecordId: string

  beforeAll(async () => {

    d = await makeDTestObj()
    d.domainTransaction = await d.domainDb.transaction()
    d.subDomainTransaction = await d.subDomainDb.transaction()

    const pageMain = makeBackendSiteDesignerPageMain(d)

    const pageRecord = await pageMain.addOne({
      slug: "/testing/should-never-be-saved-123012301230/123/123/123/"
    })

    pageRecordId = pageRecord.data.dataValues.id

  }, 100000)

  test("upsertOne: backendSiteDesignerPageLink can add record.", async () => {
    const pageSql = makeBackendSiteDesignerPageLinkSql(d)

    const upsertOne = await pageSql.upsertOne({
      pageId: pageRecordId,
      title: "title",
      description: "description",
      picture: "picture",
      pictureAlt: "pictureAlt",
    })
    recordId = upsertOne.data.dataValues.id

    expect(upsertOne.data.dataValues.pageId).toEqual(pageRecordId)
    expect(upsertOne.data.dataValues.title).toEqual("title")
    expect(upsertOne.data.dataValues.description).toEqual("description")
    expect(upsertOne.data.dataValues.picture).toEqual("picture")
    expect(upsertOne.data.dataValues.pictureAlt).toEqual("pictureAlt")
  })

  test("getOneById: backendSiteDesignerPageLink can add record.", async () => {
    const pageSql = makeBackendSiteDesignerPageLinkSql(d)

    const getOneByPageId = await pageSql.getOneByPageId({
      pageId: pageRecordId,
    })

    expect(getOneByPageId.data.dataValues.pageId).toEqual(pageRecordId)
    expect(getOneByPageId.data.dataValues.title).toEqual("title")
    expect(getOneByPageId.data.dataValues.description).toEqual("description")
    expect(getOneByPageId.data.dataValues.picture).toEqual("picture")
    expect(getOneByPageId.data.dataValues.pictureAlt).toEqual("pictureAlt")
  })

  test("upsertOne: backendSiteDesignerPageLink can update record.", async () => {
    const pageSql = makeBackendSiteDesignerPageLinkSql(d)

    const upsertOne = await pageSql.upsertOne({
      id: recordId,
      pageId: pageRecordId,
      title: "title2",
      description: "description2",
      picture: "picture2",
      pictureAlt: "pictureAlt2",
    })

    expect(upsertOne.data.dataValues.pageId).toEqual(pageRecordId)
    expect(upsertOne.data.dataValues.title).toEqual("title2")
    expect(upsertOne.data.dataValues.description).toEqual("description2")
    expect(upsertOne.data.dataValues.picture).toEqual("picture2")
    expect(upsertOne.data.dataValues.pictureAlt).toEqual("pictureAlt2")
  })

  afterAll(async () => {
    await d.domainTransaction.rollback()
    await d.subDomainTransaction.rollback()
  })
})

