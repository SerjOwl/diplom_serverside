import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import { dataProvider } from "./dataProvider";
import { CommandlogList, ErrorlogList, UserList, HardwareList, PerformanceList, NeurologList } from "./pages/lists";
import { CommandlogShow, ErrorlogShow, UserShow, HardwareShow, PerformanceShow, NeurologShow } from "./pages/shows";
import { CommandlogEdit, ErrorlogEdit, UserEdit, HardwareEdit, PerformanceEdit, NeurologEdit } from "./pages/edits";
import { NeuroStatsList } from "./pages/neurostats"
import { ErrorStatsList } from "./pages/errorstats"
import { UserGrowthList } from "./pages/usergrowth"

export const App = () => (
  <Admin layout={Layout} dataProvider={dataProvider}>

    {/* Table pages */}
    <Resource name="Users" list={UserList} show={UserShow} edit={UserEdit} />
    <Resource name="Hardware" list={HardwareList} show={HardwareShow} edit={HardwareEdit} />
    <Resource name="Performance" list={PerformanceList} show={PerformanceShow} edit={PerformanceEdit} />
    <Resource name="CommandLogs" list={CommandlogList} show={CommandlogShow} edit={CommandlogEdit} />
    <Resource name="NeuroLogs" list={NeurologList} show={NeurologShow} edit={NeurologEdit} />
    <Resource name="ErrorLogs" list={ErrorlogList} show={ErrorlogShow} edit={ErrorlogEdit} />
    
    {/* Stats pages */}
    <Resource name="NeurologStats" list={NeuroStatsList} options={{ label: 'Статистика нейросети' }} />
    <Resource name="ErrorStatsDaily" list={ErrorStatsList} options={{ label: 'Статистика ошибок' }} />
    <Resource name="UserGrowthMonthly" list={UserGrowthList} options={{ label: 'Статистика роста пользователей' }} />
  </Admin>
);
