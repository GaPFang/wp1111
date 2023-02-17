import { useState, React } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;

const Body = () => {
  const classes = useStyles();

  const { messages, addCardMessage, addRegularMessage, addErrorMessage, addRegularQueryMessage, addErrorQueryMessage } =
    useScoreCard();

  const [tabType, setTabType] = useState('ADD');
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);

  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');

  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  const handleAdd = async () => {
    const {
      data: { message, cards },
    } = await axios.post('/card', { //get params through "req.body"
      name,
      subject,
      score,
    });

    if (!cards) addErrorMessage(message);
    else {
      addCardMessage(message);
      let element = [];
      cards.forEach(card => {
        element = [...element, createData(card.name, card.subject, card.score)]
      })
      setRows(element);
      console.log(rows);
    }
  };

  const createData = (name, subject, score) => {
    return {name, subject, score};
  }

  const handleQuery = async () => {
    const {
      data: { messages, message },
    } = await axios.get('/cards', { //get params through "req.query"
      params: {
        type: queryType,
        queryString,
      },
    });

    if (!messages.length) addErrorQueryMessage(message);
    else addRegularQueryMessage(...messages);
  };

  const handleTabChange = (event, newValue) => {
    setTabType(newValue);
  };

  const table = <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell align="center">Name</TableCell>
          <TableCell align="center">Subject</TableCell>
          <TableCell align="center">Score</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row" align="center">
              {row.name}
            </TableCell>
            <TableCell align="center">{row.subject}</TableCell>
            <TableCell align="center">{row.score}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  let typoGraphies = [];
  messages.map((m, i) => {
    if (m.tabType === tabType) {
      typoGraphies = [...typoGraphies, (<Typography variant="body2" key={m + i} style={{ color: m.color }}>
        {m.message}
      </Typography>)]
    }
  })

  return (
    <Wrapper>
      <Row>
        {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
        <TextField
          className={classes.input}
          placeholder="Name"
          value={name}
          onChange={handleChange(setName)}
        />
        <TextField
          className={classes.input}
          placeholder="Subject"
          style={{ width: 240 }}
          value={subject}
          onChange={handleChange(setSubject)}
        />
        <TextField
          className={classes.input}
          placeholder="Score"
          value={score}
          onChange={handleChange(setScore)}
          type="number"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!name || !subject}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Row>
      <Row>
        <StyledFormControl>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={queryType}
              onChange={handleChange(setQueryType)}
            >
              <FormControlLabel
                value="name"
                control={<Radio color="primary" />}
                label="Name"
              />
              <FormControlLabel
                value="subject"
                control={<Radio color="primary" />}
                label="Subject"
              />
            </RadioGroup>
          </FormControl>
        </StyledFormControl>
        <TextField
          placeholder="Query string..."
          value={queryString}
          onChange={handleChange(setQueryString)}
          style={{ flex: 1 }}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!queryString}
          onClick={handleQuery}
        >
          Query
        </Button>
      </Row>
      <Tabs
        value={tabType}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="wrapped label tabs example"
        centered
      >
        <Tab value="ADD" label="ADD" />
        <Tab value="QUERY" label="QUERY" />
      </Tabs>
      <ContentPaper variant="outlined">
        {typoGraphies.map(typoGraphy => typoGraphy)}
        {table}
      </ContentPaper>
    </Wrapper>
  );
};

export default Body;
