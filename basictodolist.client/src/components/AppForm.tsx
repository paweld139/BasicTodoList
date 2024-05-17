import {
    Container,
    FormGroup,
    Input,
    Label,
    Row,
    RowProps
} from "reactstrap";

import { FormInput } from "../interfaces";

interface Props<T> {
    data: T,
    setData: (data: T) => void,
    inputs: FormInput<T>[],
    rowProps?: RowProps[]
}

const AppForm = <T,>({
    data,
    setData,
    inputs,
    rowProps
}: Props<T>) => {
    return (
        <Container fluid>
            {[...new Set(inputs.map(input => input.group))].map((group, index) => (
                <Row {...(rowProps && rowProps[index])}>
                    {inputs.filter(input => input.group === group).map(input => (
                        <FormGroup key={String(input.key)}>
                            <Label for={String(input.key)}>{input.label}</Label>
                            <Input
                                type={input.type}
                                onChange={(event) => setData({ ...data, [input.key]: event.target.value })}
                                value={String(data[input.key])}
                                id={String(input.key)}
                            />
                        </FormGroup>
                    ))}
                </Row>
            ))}
        </Container>
    );
}

export default AppForm;