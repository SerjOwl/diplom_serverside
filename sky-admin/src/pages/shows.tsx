import { 
    DateField, 
    NumberField,
    TextField,
    Show,
    SimpleShowLayout,
    EmailField,
} from 'react-admin';

export const CommandlogShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" />
            <NumberField source="user_id" />
            <DateField source="created_at" />
            <TextField source="command" />
            <TextField source="response" />
            <NumberField source="confidence_level" />
        </SimpleShowLayout>
    </Show>
);

export const ErrorlogShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" />
            <NumberField source="user_id" />
            <TextField source="error_type" />
            <TextField source="error_message" />
            <TextField source="stack_trace" />
            <DateField source="created_at" />
        </SimpleShowLayout>
    </Show>
);

export const HardwareShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" />
            <NumberField source="user_id" />
            <TextField source="cpu_model" />
            <TextField source="gpu_model" />
            <DateField source="ram_amount" />
        </SimpleShowLayout>
    </Show>
);

export const NeurologShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" />
            <NumberField source="user_id" />
            <TextField source="session_id" />
            <TextField source="prompt" />
            <TextField source="response_time" />
            <NumberField source="input_tokens" />
            <NumberField source="output_tokens" />
            <TextField source="error_message" />
        </SimpleShowLayout>
    </Show>
);

export const PerformanceShow = () => (
    <Show>
        <SimpleShowLayout>
            <NumberField source="id" />
            <NumberField source="user_id" />
            <NumberField source="cpu_usage" />
            <NumberField source="memory_usage" />
            <NumberField source="disk_usage" />
            <NumberField source="gpu_usage" />
            <NumberField source="network_usage" />
            <NumberField source="response_latency" />
            <DateField source="created_at" />
        </SimpleShowLayout>
    </Show>
);

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="username" />
            <EmailField source="email" />
            <DateField source="created_at" />
        </SimpleShowLayout>
    </Show>
);