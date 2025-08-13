import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";

const TimeSheetIndex = EgretLoadable({
  loader: () => import("./TimeSheetIndex"),
});
const ViewComponent = TimeSheetIndex;
const TimeSheetCreateOrUpdate = EgretLoadable({
  loader: () => import("./TimeSheetCreateOrUpdate"),
});
const ViewComponent2 = TimeSheetCreateOrUpdate;

const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/timesheet",
    exact: true,
    component: ViewComponent,
  },
  {
    path: ConstantList.ROOT_PATH + "category/timesheet/update/:id",
    exact: true,
    component: ViewComponent2,
  },
  {
    path: ConstantList.ROOT_PATH + "category/timesheet/create",
    exact: true,
    component: ViewComponent2,
  },
];

export default Routes;
