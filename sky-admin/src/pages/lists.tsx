import { 
    Datagrid, 
    DateField, 
    List, 
    NumberField,
    FunctionField,
    TextField,
} from 'react-admin';
import ExpandPanel from "../modules/expandpanel"
import { TruncateText } from '../modules/utils';

export const CommandlogList = () => (
    <List>
        <Datagrid
            expand={<ExpandPanel fields={[ 'command','response' ]} />}
        >
            <NumberField source="id" />
            <NumberField source="user_id" />
            <DateField source="created_at" />
            <FunctionField label="Command" source="command" render={(record) => TruncateText(record.command)} />
            <FunctionField label="Response" source="response" render={(record) => TruncateText(record.response)} />
            <NumberField source="confidence_level" />
        </Datagrid>
    </List>
);

export const ErrorlogList = () => (
    <List>
        <Datagrid
            expand={<ExpandPanel fields={[ 'error_type','error_message','stack_trace' ]} />}
        >
            <NumberField source="id" />
            <NumberField source="user_id"/>
            <FunctionField label="Error type" source="error_type" render={(record) => TruncateText(record.error_type)} />
            <FunctionField label="Error message" source="error_message" render={(record) => TruncateText(record.error_message)} />
            <FunctionField label="Stack trace" source="stack_trace" render={(record) => TruncateText(record.stack_trace)} />
            <DateField source="created_at" />
        </Datagrid>
    </List>
);

export const HardwareList = () => (
    <List>
        <Datagrid>
            <NumberField source="id" />
            <NumberField source="user_id"/>
            <TextField source="cpu_model" />
            <TextField source="gpu_model" />
            <TextField source="ram_amount" />
        </Datagrid>
    </List>
);

export const NeurologList = () => (
    <List>
        <Datagrid
            expand={<ExpandPanel fields={[ 'session_id','prompt','error_message' ]} />}
        >
            <NumberField source="id" />
            <NumberField source="user_id"/>
            <FunctionField label="Session id" source="session_id" render={(record) => TruncateText(record.session_id)} />
            <FunctionField label="Prompt" source="prompt" render={(record) => TruncateText(record.prompt)} />
            <TextField source="response_time" />
            <NumberField source="input_tokens" />
            <NumberField source="output_tokens" />
            <FunctionField label="Error message" source="error_message" render={(record) => TruncateText(record.error_message)} />
        </Datagrid>
    </List>
);

export const PerformanceList = () => (
    <List>
        <Datagrid>
            <NumberField source="id" />
            <NumberField source="user_id"/>
            <NumberField source="cpu_usage" />
            <NumberField source="memory_usage" />
            <NumberField source="disk_usage" />
            <NumberField source="gpu_usage" />
            <NumberField source="network_usage" />
            <NumberField source="response_latency" />
            <DateField source="created_at" />
        </Datagrid>
    </List>
);

export const UserList = () => (
    <List>
        <Datagrid
            expand={<ExpandPanel fields={[ 'username','email' ]} />}
        >
            <NumberField source="id" />
            <FunctionField label="Username" source="username" render={(record) => TruncateText(record.username)} />
            <FunctionField label="Email" source="email" render={(record) => TruncateText(record.email)} />
            <DateField source="created_at" />
        </Datagrid>
    </List>
);