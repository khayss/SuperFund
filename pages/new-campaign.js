import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { factory } from "../ethereum/scripts/factory";
import web3 from "../ethereum/scripts/web3";
import {
  Button,
  Container,
  Form,
  FormField,
  Input,
  Label,
  Message,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

export default function request() {
  const [amount, setAmount] = useState("");
  const [btnState, setBtnState] = useState(false);
  const [submitErrorMsg, setSubmitErrorMsg] = useState("");
  const [errorStatus, setErrorStatus] = useState(false);
  const [successStatus, setSuccessStatus] = useState(false);
  const router = useRouter();
  const changeHandler = (e) => {
    setAmount(e.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnState(true);
    setErrorStatus(false);
    setSubmitErrorMsg("");
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(web3.utils.toWei(parseFloat(amount), "ether"))
        .send({ from: accounts[0] });
      setSuccessStatus(true);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      setErrorStatus(true);
      setSubmitErrorMsg(err.message);
      setTimeout(() => {
        setErrorStatus(false);
      }, 30000);
    }
    setBtnState(false);
  };
  return (
    <div>
      <Container>
        <Form
          size="large"
          onSubmit={submitHandler}
          error={errorStatus}
          success={successStatus}
        >
          <FormField>
            <label>Minimum Contribution</label>
            <Input
              type="number"
              placeholder="enter min. contribution"
              labelPosition="right"
              label={{ content: "Ether" }}
              value={amount}
              onChange={changeHandler}
            />
          </FormField>
          <Message error header="Ooops!!!" content={submitErrorMsg} />
          <Message success header="Success" content="Campaign created" />
          <Button type="submit" primary loading={btnState} disabled={btnState}>
            Create!
          </Button>
        </Form>
      </Container>
    </div>
  );
}
