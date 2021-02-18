//default react imports
import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
//bootstrap
import {Container, Row, Col, Card, Button, Modal, ListGroup, ListGroupItem, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit, FaUpload, FaEye} from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";
//API
import newsservice from "services/newsservice";

export default function CreateArticle({apiToken}) {

    //States
    const [ModalArticleShow, setModalArticleShow] = useState(false);
    const [ModalPreviewShow, setModalPreviewShow] = useState(false);
    const [Article, setArticle] = useState({});

    const closeArticleModal = () => {
        setMsgArticleInfo("Err Msg.");
        setShowArticleInfoAlert(false);
        setModalArticleShow(false);
        setImageFile(null);
    };

    const handleCreateArticle = async() => {
        
        const formData = new FormData();
        formData.append("articleTitle", Article.articleTitle);
        formData.append("articleDescription", Article.articleDescription);
        formData.append("articleType", Article.articleType);
        formData.append("articleContent", Article.articleContent);
        formData.append("articleImagePath", imagePath != null ? imagePath : "RemoveImage");
        formData.append("articleImageFile", imageFile);

        await newsservice.CreateArticle(apiToken,formData).then(res => {
            closeArticleModal();
        }).catch(err => {
            if(err?.response?.data?.ArticleTitle != null)
            {
                setMsgArticleInfo(err?.response?.data?.ArticleTitle[0]);
                setShowArticleInfoAlert(true);
            }
            else if(err?.response?.data?.ArticleDescription != null)
            {
                setMsgArticleInfo(err?.response?.data?.ArticleDescription[0]);
                setShowArticleInfoAlert(true);
            }
            else if(err?.response?.data?.ArticleType != null)
            {
                setMsgArticleInfo(err?.response?.data?.ArticleType[0]);
                setShowArticleInfoAlert(true);
            }
            else if(err?.response?.data?.ArticleContent != null)
            {
                setMsgArticleInfo(err?.response?.data?.ArticleContent[0]);
                setShowArticleInfoAlert(true);
            }
            else 
            {
                setMsgArticleInfo(err?.response?.data);
                setShowArticleInfoAlert(true);
            }
        });
    };

    const changeTitle = (e) => {
        setArticle({...Article, articleTitle: e.target.value});
    };

    const changeType = (e) => {
        setArticle({...Article, articleType: e.target.value});
    };

    const changeDescription = (e) => {
        setArticle({...Article, articleDescription: e.target.value});
    };

    const changeContent = (e) => {
        setArticle({...Article, articleContent: e.target.value});
    };

    //#region EditTeamImage
    const [imagePath, setImagePath] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileUploader = useRef();


    const setPreview = (evt) => {
        if (evt.target.files && evt.target.files[0]) {
            let imgFile = evt.target.files[0];
            const reader = new FileReader();
            reader.onload = (x) => {
                setImagePath(x.target.result);
                setImageFile(imgFile);
            };
            reader.readAsDataURL(imgFile);
        }
    };

    const updateImage = (e) => {
        fileUploader.current.click();
    }

    const removeImage = () => {
        setImageFile(null);
        setImagePath(null);
    };
    //#endregion


    //#region errorMsg
    const [msgArticleInfo, setMsgArticleInfo] = useState("Error msg");
    const [showArticleInfoAlert, setShowArticleInfoAlert] = useState(false);
    function ArticleInfoAlert() {
        if (showArticleInfoAlert) {
            return (
                <Alert className="" variant="danger" onClose={() => setShowArticleInfoAlert(false)} dismissible data-testid="captainPageTeamAlert">
                    <p className="my-auto" data-testid="captainPageTeamAlertText">
                        {msgArticleInfo}
                    </p>
                </Alert>
            );
        }
        return <> </>;
    };

    return (
        <>
            <Button variant={"primary"} size={"lg"} onClick={() => setModalArticleShow(true)} className="btn-block">Create new division</Button>
            <Modal
            size={"xl"}
            show={ModalArticleShow}
            onHide={closeArticleModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton >
                <Modal.Title className="font-weight-bold">
                Create new article
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Container>
                <Form autoComplete="off">
                <Form.Control type="text" hidden defaultValue="stopstupidautocomplete"/>
                <Form.Group>
                <Form.Row className="mb-2">
                <Form.Label column lg={3} className="font-weight-bold">
                        Article image:
                    </Form.Label>
                            <Col md={7} xs={7} className="my-auto p-0">
                                {imagePath != null ? <div className="news-banner-preview position-relative"><Image layout={"fill"} alt={"art img"} src={imagePath} draggable={false}></Image></div> :
                                    <Img alt={""} src={require("public/images/news_placeholder.jpg")} className="news-banner-preview" draggable={false}></Img>
                                }
                            </Col>
                            <Col className="my-auto p-0 ml-2">
                                <Button className="btn-block" onClick={updateImage} >Upload image <FaUpload className="my-auto" /></Button>
                                <Button variant="danger" className="btn-block" onClick={removeImage} >Remove image <FaTrashAlt className="my-auto" /></Button>
                                <Form.File id="TeamImageFile" hidden ref={fileUploader} onChange={setPreview}  accept="image/x-png,image/gif,image/jpeg" />
                            </Col>
                              
                        </Form.Row>
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article title:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter article title..." value={Article?.articleTitle} onChange={changeTitle}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article description:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" as={"textarea"} className="articleDesc" maxLength={255} placeholder="Enter description of the article..." value={Article?.articleDescription} onChange={changeDescription}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article type:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter article type..." value={Article?.articleType} onChange={changeType}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article content:
                    </Form.Label>
                    <Col>
                        <FaEye className="previewButton Clickable" onClick={() => setModalPreviewShow(true)} />
                        <Form.Control type="text" as={"textarea"} className="articleContent" maxLength={1000} placeholder="Article content here..." value={Article?.articleContent} onChange={changeContent}/>      
                    </Col>
                </Form.Row>
                <br />
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><ArticleInfoAlert /></Col></Row>
            <Row>
            <Col md={2} xs={2}><Button variant="danger" className="btn-block" onClick={closeArticleModal}>Cancel</Button></Col>
                <Col><Button className="btn-block" onClick={handleCreateArticle}>Create article</Button></Col>
            </Row>
            </Modal.Body>
            </Modal>

            <Modal
            size={"lg"}
            show={ModalPreviewShow}
            onHide={() => setModalPreviewShow(false)}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h6 className="font-weight-bold">Content preview</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
           <div dangerouslySetInnerHTML={{__html: Article?.articleContent != null ? DOMPurify.sanitize(Article?.articleContent) : ""}}></div>                
              </Modal.Body>
            </Modal>
        </>
    );
}