import React, { useEffect, useState } from "react";
import { factory } from "../ethereum/scripts/factory.js";
import "semantic-ui-css/semantic.min.css";
import {
  Button,
  Card,
  CardGroup,
  Container,
  Grid,
  GridColumn,
  GridRow,
} from "semantic-ui-react";

export default function main() {
  const [campaigns, setCampaigns] = useState([]);
  async function getCampaigns() {
    const result = await factory.methods.getCampaigns().call();
    setCampaigns(result);
  }

  useEffect(() => {
    getCampaigns();
  }, []);

  return (
    <div>
      <Container>
        <Grid>
          <GridRow>
            <GridColumn width={13}>
              <CardGroup>
                {campaigns.map((campaign, index) => (
                  <Card
                    fluid
                    color="blue"
                    header={campaign}
                    description={`Campaign number: ${index + 1}`}
                  />
                ))}
              </CardGroup>
            </GridColumn>
            <GridColumn width={3}>
              <Button primary>New Campaign</Button>
            </GridColumn>
          </GridRow>
        </Grid>
      </Container>
    </div>
  );
}
