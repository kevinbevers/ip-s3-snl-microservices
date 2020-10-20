//default react imports
import React, { useState } from 'react';
//boostrap components
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';

export default function ScoreTable() {
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