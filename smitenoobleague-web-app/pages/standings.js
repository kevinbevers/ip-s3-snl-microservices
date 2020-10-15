//default react imports
import React, { useState } from 'react';
//default page stuff
import NavBar from '../src/components/NavBar';
import Footer from '../src/components/Footer';
//boostrap components
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
//page imports
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
//import background component and the image for it
import FullBackground from '../src/components/FullBackground'
import BG from '../public/images/dark_bg.png'


// move to component and give it props to fill the table. array of data
function ScoreTable() {
  return (
    <>
      <Row className="mt-4">
        <Col md={3}></Col>
        <Col md={6} className="">
          <h5 className="text-center font-weight-bold bg-light mb-0 p-2 rounded-top"><u>Current standing for Divisionname</u></h5>
          <Table responsive  variant='light' className='rounded-bottom'>
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Teamname</td>
                <td>20</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Teamname</td>
                <td>15</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Teamname</td>
                <td>12</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Teamname</td>
                <td>11</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Teamname</td>
                <td>10</td>
              </tr>
              <tr>
                <td>6</td>
                <td>Teamname</td>
                <td>6</td>
              </tr>
              <tr>
                <td>7</td>
                <td>Teamname</td>
                <td>3</td>
              </tr>
              <tr>
                <td>8</td>
                <td>Teamname</td>
                <td>1</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={3}></Col>
      </Row>
    </>
  );
}


export default function standings() {

  const [SelectedDivision, setSelectedDivision] = useState('Godlike division');

  const changeDivision = (evt) => {
    setSelectedDivision(evt.target.value);
    console.log(evt.target.value);
  }



  return (
    <>
      <FullBackground src={BG} />
      <NavBar />
      <Container>
        <Row className="mt-4">
          <Col md={6} className="mx-auto">
            <Form>
              <Form.Group controlId="exampleForm.SelectCustom">
                <Form.Control as="select" custom onChange={changeDivision} value={SelectedDivision}>
                  <option value="1">Godlike division</option>
                  <option value="2">Prime division</option>
                  <option value="3">Bronze division</option>
                  <option value="4">Sweat division</option>
                  <option value="5">Divine division</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
       <ScoreTable />
      </Container>
      <Footer />
    </>
  );
}