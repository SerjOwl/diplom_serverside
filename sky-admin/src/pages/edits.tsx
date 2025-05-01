import { 
    DateInput, 
    Edit, 
    SimpleForm, 
    TextInput, 
    NumberInput,
} from 'react-admin';

export const ErrorlogEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <NumberInput source="user_id" />
            <TextInput source="error_type" />
            <TextInput source="error_message" />
            <TextInput source="stack_trace" />
            <DateInput source="created_at" />
        </SimpleForm>
    </Edit>
);

export const HardwareEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <NumberInput source="user_id" />
            <TextInput source="cpu_model" />
            <TextInput source="gpu_model" />
            <DateInput source="ram_amount" />
        </SimpleForm>
    </Edit>
);

export const PerformanceEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <NumberInput source="user_id" />
            <NumberInput source="cpu_usage" />
            <NumberInput source="memory_usage" />
            <NumberInput source="disk_usage" />
            <NumberInput source="gpu_usage" />
            <NumberInput source="network_usage" />
            <NumberInput source="response_latency" />
            <DateInput source="created_at" />
        </SimpleForm>
    </Edit>
);

export const CommandlogEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <NumberInput source="user_id" />
            <DateInput source="created_at" />
            <TextInput source="command" />
            <TextInput source="response" />
            <NumberInput source="confidence_level" />
        </SimpleForm>
    </Edit>
);

export const NeurologEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <NumberInput source="user_id" />
            <TextInput source="session_id" />
            <TextInput source="prompt" />
            <TextInput source="response_time" />
            <NumberInput source="input_tokens" />
            <NumberInput source="output_tokens" />
            <TextInput source="error_message" />
        </SimpleForm>
    </Edit>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <NumberInput source="id" />
            <TextInput source="username" />
            <TextInput source="email" />
            <DateInput source="created_at" />
        </SimpleForm>
    </Edit>
);