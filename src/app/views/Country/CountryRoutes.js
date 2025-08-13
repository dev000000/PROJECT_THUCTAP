import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
const CountryIndex = EgretLoadable({
  loader: () => import("./CountryIndex"),
});
const CountryDetail = EgretLoadable({
  loader: () => import("./CountryDetail"),
});
const ViewComponent = CountryIndex;
const ViewComponent2 = CountryDetail;


const Routes = [
  {
    path: ConstantList.ROOT_PATH + "category/country",
    exact: true,
    component: ViewComponent,
  },
  {
    path: ConstantList.ROOT_PATH + "category/country/:id",
    exact: true,
    component: ViewComponent2,
  },
];

export default Routes;
