import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";

interface AccordionItemProps {
  title: string;
  links?: { label: string; path: string }[];
  children?: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  links,
  children,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {links?.map((link, index) => (
            <ListItem key={index}>
              <Link href={link.path} passHref>
                {link.label}
              </Link>
            </ListItem>
          ))}
          {children}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionItem;