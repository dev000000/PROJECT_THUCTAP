import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";

const StaffIndex = EgretLoadable({
  loader: () => import("./StaffIndex"),
});
const ViewComponent = StaffIndex;
const StaffCreateOrUpdate = EgretLoadable({
  loader: () => import("./StaffCreateOrUpdate"),
});
const ViewComponent2 = StaffCreateOrUpdate;

const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/staff",
    exact: true,
    component: ViewComponent,
  },
  {
    path: ConstantList.ROOT_PATH + "category/staff/update/:id",
    exact: true,
    component: ViewComponent2,
  },
  {
    path: ConstantList.ROOT_PATH + "category/staff/create",
    exact: true,
    component: ViewComponent2,
  },
];

export default Routes;
