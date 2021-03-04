//default react imports
import React, { useState, useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";
//bootstrap
import {Container, Row, Col, Card, Button, Modal, ListGroup, ListGroupItem, Form, Alert} from "react-bootstrap";
//icons
import {FaTrashAlt, FaEdit, FaUpload, FaEye} from "react-icons/fa";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";
//API
import newsservice from "services/newsservice";


export default function ManageArticleListItem({apiToken, articledata, removeArticleFunc}) {

    //States
    const [hovering, setHovering] = useState(false);
    const [ModalAreYouSure, setModalAreYouSure] = useState(false);
    const [ModalArticleShow, setModalArticleShow] = useState(false);
    const [ModalPreviewShow, setModalPreviewShow] = useState(false);
    const [Article, setArticle] = useState({});
    const [imagePath, setImagePath] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileUploader = useRef();

    const closeArticleModal = () => {
        setMsgArticleInfo("Err Msg.");
        setShowArticleInfoAlert(false);
        setModalArticleShow(false);
        setImageFile(null);
    };

    const deleteArticle = async() => {
        await newsservice.DeleteArticle(apiToken, articledata.articleSlug).then(res => {removeArticleFunc(articledata.articleSlug); setModalAreYouSure(false);}).catch(err => {console.log(err)});
    };

    const editArticle = async() => {
        await newsservice.GetArticleBySlug(articledata.articleSlug).then(res => { 
            setArticle(res.data);
            console.log(res.data);
            setImagePath(res.data?.articleImagePath != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/news-service/images/" + res.data?.articleImagePath : null);
             setModalArticleShow(true); }).catch(err => {});
    };

    const handleEditArticle = async() => {
        
        const formData = new FormData();
        formData.append("articleSlug", Article.articleSlug);
        formData.append("articleTitle", Article.articleTitle);
        formData.append("articleDescription", Article.articleDescription);
        formData.append("articleType", Article.articleType);
        formData.append("articleContent", Article.articleContent);
        formData.append("articleImagePath", imagePath != null ? imagePath : "RemoveImage");
        formData.append("articleImageFile", imageFile);

        await newsservice.EditArticle(apiToken,formData).then(res => {
            //update in parent
            articledata.articleTitle = Article.articleTitle;
            articledata.articleDescription = Article.articleDescription;
            articledata.articleImagePath = imagePath;
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
    useEffect(() => {
        setImagePath(articledata?.articleImagePath != null ? process.env.NEXT_PUBLIC_BASE_API_URL + "/news-service/images/" + articledata?.articleImagePath : null);
    }, []);


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
            <Row className="mb-1" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                <Col lg={11} xs={11} className="mb-0"><ListGroupItem onClick={editArticle} className="d-flex align-items-center Clickable adminTeamListItem">{articledata.articleTitle} {hovering ? <p className="text-muted ml-auto mb-0">Click to edit</p> : <> </>}</ListGroupItem></Col>
                <Col lg={1} xs={1} className="btn-group p-0">
                    {hovering ?
                    <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable" title="Delete article" onClick={() => setModalAreYouSure(true)} /> : <FaTrashAlt size={22} className="adminDeleteButton my-auto Clickable d-block d-sm-block d-lg-none" title="Delete division" onClick={() => setModalAreYouSure(true)} /> }
                </Col>
            </Row>
            <Modal
            size={"xl"}
            show={ModalArticleShow}
            onHide={closeArticleModal}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton >
                <Modal.Title className="font-weight-bold">
                Edit article info
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
                    <Form.Control type="text" placeholder="Enter article title..." value={Article?.articleTitle} maxLength={60} onChange={changeTitle}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article description:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" as={"textarea"} className="articleDesc" maxLength={300} placeholder="Enter description of the article..." value={Article?.articleDescription} onChange={changeDescription}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article type:
                    </Form.Label>
                    <Col>
                    <Form.Control type="text" placeholder="Enter article type..." value={Article?.articleType} onChange={changeType} maxLength={45}/>
                    </Col>
                </Form.Row>
                <br />
                <Form.Row>
                    <Form.Label column lg={3} className="font-weight-bold">
                        Article content:
                    </Form.Label>
                    <Col>
                        <FaEye className="previewButton Clickable" onClick={() => setModalPreviewShow(true)} />
                        <Form.Control type="text" as={"textarea"} className="articleContent" maxLength={4000} placeholder="Article content here..." value={Article?.articleContent} onChange={changeContent}/>      
                    </Col>
                </Form.Row>
                <br />
                </Form.Group>
                </Form>
            </Container>
            <Row><Col><ArticleInfoAlert /></Col></Row>
            <Row>
            <Col md={2} xs={2}><Button variant="danger" className="btn-block" onClick={closeArticleModal}>Cancel</Button></Col>
                <Col><Button className="btn-block" onClick={handleEditArticle}>Save changes</Button></Col>
            </Row>
            </Modal.Body>
            </Modal>

            <Modal
            size={"sm"}
            show={ModalAreYouSure}
            onHide={() => setModalAreYouSure(false)}
            aria-labelledby="manage-team-modal"
            >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h6 className="font-weight-bold">Are you sure you want to delete: <br/><br/> {articledata?.title}</h6>
                </Modal.Title>
            </Modal.Header>
           <Modal.Body>
              <Row>
                  <Col className="justify-content-end d-flex p-auto">
                      <Button variant="primary" className="mr-2 font-weight-bold" onClick={() => setModalAreYouSure(false)}>
                          Cancel
                      </Button>

                      <Button className="font-weight-bold" onClick={deleteArticle} variant="danger">
                          Delete article
                      </Button>
                  </Col>
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