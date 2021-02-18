//default react imports
import React, { useState, useEffect } from "react";
//bootstrap
import {Container, Row, Col, Button, Modal, ListGroup, Form, Alert, ListGroupItem} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit} from "react-icons/fa";
//custom imports
import ManageArticleListItem from "src/components/managepage/managearticleListItem";
//API
import newsservice from "services/newsservice";

export default function ManageArticles({apiToken}) {

    const [modalListShow, setModalListShow] = useState(false);
    const closeListModal = () => {
        setModalListShow(false);
        setIndex(1);
        setArticlesRemaining(false);
    };

    //Article states
    const [ArticlesState, setArticlesState] = useState([]);
    const [index, setIndex] = useState(1);
    const [articlesRemaining, setArticlesRemaining] = useState(false);
  
    const loadMoreArticles = async() => {
      if(articlesRemaining)
      {
        await newsservice.GetArticleList(8,index)
        .then(res => {
          setArticlesState(ArticlesState.concat(res.data)); 
          setIndex(index + 1); 
          setArticlesRemaining(res.data?.length > 7)
        }).catch(err => {setArticlesRemaining(false); });
      }
    };

    const openManageArticles = async() => {
        await newsservice.GetArticleList().then(res => {setArticlesState(res.data); setArticlesRemaining(res?.data?.length > 7) }).catch(err => {});
        setModalListShow(true);
      };

      function RemoveArticle(slug){
        let art = ArticlesState;
        const arr = art.filter((item) => item.articleSlug !== slug);
        setArticlesState(arr);
      };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={openManageArticles} className="btn-block">Manage existing articles</Button>
            <Modal
            size="lg"
            show={modalListShow}
            onHide={closeListModal}
            aria-labelledby="manage-division-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title className="font-weight-bold">
                Manage existing articles
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Row>
                    <Col lg={10} xs={12} className="mx-auto">    
                     {ArticlesState != null ? <><ListGroup>
                            {ArticlesState.map((a, index) => (
                                   <ManageArticleListItem key={index} apiToken={apiToken} articledata={a} removeArticleFunc={RemoveArticle} />
                            ))}
                           </ListGroup>
                           {articlesRemaining ?  
            <Button variant={"primary"} className="text-center mb-2 btn-block" onClick={loadMoreArticles}>
                Load more news articles...
            </Button> : <> </> }</> : 
                            <> 
                            <Row className="mt-5">
                                <Col md={3}></Col>
                                <Col md={6} className="d-inline-flex justify-content-center">
                                <Alert variant="warning" className="rounded">
                                <h3 className="ml-2 mr-2 mb-0 align-self-center font-weight-bold">No articles found.</h3>
                                </Alert>
                                </Col>
                                <Col md={3}></Col>
                            </Row> 
                            </>}
                    </Col>
                </Row>
            </Container>
            </Modal.Body>
            </Modal>
        </>
    );
}