import { 
    useRecordContext,
} from 'react-admin';

interface ExpandPanelProps {
    fields: string[];
}

const ExpandPanel: React.FC<ExpandPanelProps> = ({ fields }) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <div>
            {fields.map(field => (
                <div key={field}>
                    <strong>{field}:</strong> {String(record[field])}
                </div>
            ))}
        </div>
    );
};

export default ExpandPanel