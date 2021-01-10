//default react imports
import React, { useState } from "react";
//default page stuff
import NavBar from "../src/components/NavBar";
import Footer from "../src/components/Footer";
//boostrap components
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
//import background component
import FullBackground from "../src/components/FullBackground";
//Auth
import auth0 from "utils/auth0";

export default function rules({LoginSession}) {
  return (
    <>
        <FullBackground src={"rules_bg"} />
      <NavBar LoginSession={LoginSession}/>
      <Container className="mt-4">
        <Row>
          <Col md={2} xl={3}></Col>
          <Col md={8} xl={6}>
            <Alert variant="dark">
              <Alert.Heading className="text-center"><b>Table of contents</b></Alert.Heading>
              <h5 className="text-center">Smitenoobleague rules</h5>
              <hr />
              <Row>
                <Col md={7} className="mx-auto">
              <div id="content-table" className="ml-3">
              <a href="#rule1"><b>1. Match rules</b></a><br />
              <a href="#rule1.1" className="subrule">1.1. Be there or be square</a><br />
              <a href="#rule1.2" className="subrule">1.2. Substitute player</a><br />
              <a href="#rule1.3" className="subrule">1.3. Home team & Away team</a><br />
              <a href="#rule1.4" className="subrule">1.4. Match settings</a><br />
              <a href="#rule1.5" className="subrule">1.5. Ending of a match</a><br />

              <a href="#rule2"><b>2. Scheduling rules</b></a><br />
              <a href="#rule2.1" className="subrule">2.1. Planning the match</a><br />
              <a href="#rule2.2" className="subrule">2.2. Unavailability</a><br />
              <a href="#rule2.3" className="subrule">2.3. Catch-up match</a><br />
              <a href="#rule2.4" className="subrule">2.4. Not playing on purpose.</a><br />

              <a href="#rule3"><b>3. Team / roster rules</b></a><br />
              <a href="#rule3.1" className="subrule">3.1. Trading players</a><br />
              <a href="#rule3.2" className="subrule">3.2. Free agents</a><br />
              <a href="#rule3.3" className="subrule">3.3. Player availability</a><br />
              <a href="#rule3.4" className="subrule">3.4. Teamname and logo</a><br />

              <a href="#rule4"><b>4. General league rules</b></a><br />
              <a href="#rule4.1" className="subrule">4.1. Match format</a><br />
              <a href="#rule4.2" className="subrule">4.2. Player investment</a><br />
              <a href="#rule4.3" className="subrule">4.3. Clear communication</a><br />
              <a href="#rule4.3" className="subrule">4.3. Input devices</a><br />

              <a href="#rule5"><b>5. In-game rules</b></a><br />
              <a href="#rule5.1" className="subrule">5.1. Pausing</a><br />
              <a href="#rule5.2" className="subrule">5.2. Inappropriate playername</a><br />
              <a href="#rule5.3" className="subrule">5.3. Intentional feeding</a><br />
              <a href="#rule5.4" className="subrule">5.4. Banned skins</a><br />
              </div>
              </Col>
              </Row>
            </Alert>
          </Col>
          <Col md={2} xl={3}></Col>
        </Row>
        <Row>
        <Col md={1} xl={2}></Col>
          <Col md={10} xl={8} className="bg-light rounded p-5 mb-4">
            {/* Rules Section 1 */}
          <h4 id="rule1" className="font-weight-bold">1. Match rules</h4>
          <p>In this section the rules for setting up the match and what should be done before and after a match will be described.</p>
          <h5 id="rule1.1" className="font-weight-bold">1.1. Be there or be square</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule1.2" className="font-weight-bold">1.2. Substitute player</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule1.3" className="font-weight-bold">1.3. Home team & Away team</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule1.4" className="font-weight-bold">1.4. Match settings</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule1.5" className="font-weight-bold">1.5. Ending of a match</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          {/* Rules Section 2 */}
          <h4 id="rule2" className="font-weight-bold">2. Scheduling rules</h4>
          <p>In this section the rules for Scheduling a match are described and what happens when you can"t or don"t show up.</p>
          <h5 id="rule2.1" className="font-weight-bold">2.1. Planning the match</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule2.2" className="font-weight-bold">2.2. Unavailability</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule2.3" className="font-weight-bold">2.3. Catch-up match</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule2.4" className="font-weight-bold">2.4. Not playing on purpose.</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          {/* Rules Section 3 */}
          <h4 id="rule3" className="font-weight-bold">3. Team / roster rules</h4>
          <p>In this section the rules for teams and rosters get described, what is allowed as a team and what is not.</p>
          <h5 id="rule3.1" className="font-weight-bold">3.1. Trading players</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule3.2" className="font-weight-bold">3.2. Free agents</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule3.3" className="font-weight-bold">3.3. Player availability</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule3.4" className="font-weight-bold">3.4. Teamname and logo</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          {/* Rules Section 4 */}
          <h4 id="rule4" className="font-weight-bold">4. General league rules</h4>
          <p>In this section the general rules for the league get layed-out.</p>
          <h5 id="rule4.1" className="font-weight-bold">4.1. Match format</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule4.2" className="font-weight-bold">4.2. Player investment</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule4.3" className="font-weight-bold">4.3. Clear communication</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule4.4" className="font-weight-bold">4.4. Input devices</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          {/* Rules Se5tion 5 */}
          <h4 id="rule5" className="font-weight-bold">5. In-game rules</h4>
          <p>In this section the in-game rules for players get described.</p>
          <h5 id="rule5.1" className="font-weight-bold">5.1. Pausing</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule5.2" className="font-weight-bold">5.2. Inappropriate playername</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule5.3" className="font-weight-bold">5.3. Intentional feeding</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          <h5 id="rule5.4" className="font-weight-bold">5.4. Banned skins</h5>
          <p>Aenean dignissim odio convallis urna sagittis, non tincidunt leo laoreet. Duis condimentum quis nisl a malesuada. Maecenas augue magna, volutpat et justo tempor, luctus iaculis lorem. Pellentesque a eros vitae mi vulputate fringilla quis et mauris. Pellentesque et massa ut lacus dictum convallis a nec dui. Pellentesque posuere neque a neque pulvinar feugiat. Fusce ac scelerisque massa, eu faucibus enim. Aenean ultrices, quam eget fringilla varius, risus lorem venenatis justo, rhoncus ullamcorper lacus ligula ac nisi. Vivamus et lacus felis. Integer aliquet augue eu erat facilisis sagittis. Sed porttitor ex urna, id luctus ipsum posuere vitae. Integer efficitur neque gravida erat mollis, eu malesuada mauris egestas. In sapien neque, rhoncus ac viverra sit amet, mollis eget tellus.</p>
          </Col>
          <Col md={1} xl={2}></Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  //get session
  const session = await auth0.getSession(context.req);
  //Check if logged in user is captain to show captainpage in navbar
  let Captain = false;

  if(session?.user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].includes("Captain"))
  {
    Captain = true;
  }
  else {
    Captain = false;
  }

  return {
      props: {
          LoginSession: {
          user: session?.user || null,
          isCaptain: Captain
          }
      },
  };
}


