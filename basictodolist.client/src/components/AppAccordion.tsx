import { useState } from "react";

import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem
} from "reactstrap";

interface Props {
    header: string;
    children: React.ReactNode;
}

const AppAccordion = ({
    header,
    children
}: Props) => {
    const [open, setOpen] = useState('1');

    const toggle = (id: string) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };

    return (
        <Accordion
            open={open}
            toggle={toggle}
        >
            <AccordionItem>
                <AccordionHeader targetId="1">{header}</AccordionHeader>

                <AccordionBody accordionId="1">{children}</AccordionBody>
            </AccordionItem>
        </Accordion>
    );
}

export default AppAccordion;