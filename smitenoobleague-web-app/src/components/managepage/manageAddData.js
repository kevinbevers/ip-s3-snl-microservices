//default react imports
import React, { useState, useEffect, useRef } from "react";
//bootstrap components
import { Container, Row, Col, Form, Card, Button, Badge, Toast, Alert, NavDropdown } from "react-bootstrap";
import { Table } from "react-bootstrap";
//custom imports
import Link from "next/link";
import { FaEdit, FaCheck, FaBan, FaUpload } from "react-icons/fa";
//API
import captainservice from "services/captainservice";
//image optimization
import Img from 'react-optimized-image';
import Image from "next/image";

export default function ManageAddData({ listOfGods, listOfItems, homeTeam, awayTeam, submitFunction, disableButton }) {

    // custom loader, this one doesn't use server performance and just displays the image vanilla
    const imageLoader = ({ src, width, quality }) => {
        // return `${src}?w=${width}&q=${quality || 75}`
        return `${src}`;
    };

    const RenderTeamImage = (t) => {

        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return (t?.teamLogoPath != null ? <Image priority={true} height={50} width={50} alt={t?.teamName} src={imagePath} className="TeamLogo" draggable={false}></Image> :
            <Img webp width={50} height={50} alt={t?.teamName} src={require("public/images/teamBadge.png")} className="TeamLogo" draggable={false}></Img>);
    };

    const [homePlayersData, setHomePlayersData] = useState([{ won: true }, { won: true }, { won: true }, { won: true }, { won: true }]);
    const [awayPlayersData, setAwayPlayersData] = useState([{ won: false }, { won: false }, { won: false }, { won: false }, { won: false }]);
    const [won, setWon] = useState(1);

    const [formD, setFormD] = useState({
        patchNumber: null,
        gameID: null,
        entryDate: new Date().toISOString(),
        matchDurationInSeconds: null,
        matchDuration: null,
        winners: [{}, {}, {}, {}, {}],
        losers: [{}, {}, {}, {}, {}],
        bannedGods: [{
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }, {
            godId: 0,
            godName: "string",
            godIcon: null
        }],
        gamemodeID: 429
    });

    //#region godSearch
    const [GodsMatched, setGodsMatched] = useState([]);
    const [SearchValue, setSearchValue] = useState("");

    const searchChange = (evt) => {
        setSearchValue(evt.target.value);

        if (evt.target.value?.length > 0) {
            setGodsMatched(listOfGods.filter(g =>
                g.name?.toLowerCase().includes(evt.target.value.toLowerCase())
            ));
        }
        else {
            setGodsMatched(listOfGods);
        }
    };

    useEffect(() => {
        setGodsMatched(listOfGods);
    }, [listOfGods]);
    //#endregion

    const patchNumber = useRef();
    const gameID = useRef();
    const matchDuration = useRef();
    // let value1=input1.current.value

    const submitMatchData = () => {
        let updateFormD = { ...formD };
        updateFormD.patchNumber = patchNumber.current.value;
        updateFormD.gameID = ((Number)(gameID?.current?.value));
        updateFormD.matchDuration = matchDuration.current.value;
        updateFormD.matchDurationInSeconds = (Number)(convertMS(matchDuration.current.value));
        // Make sure we don't get 8 players on 1 side because of the won status not updating correctly.
        let updatedHomePlayersData = [...homePlayersData];
        let updatedAwayPlayersData = [...awayPlayersData];
        if (won == 1) {
            updatedHomePlayersData.forEach(element => {
                element.won = true;
            });
            updatedAwayPlayersData.forEach(element => {
                element.won = false;
            });
        }
        else {
            updatedHomePlayersData.forEach(element => {
                element.won = false;
            });
            updatedAwayPlayersData.forEach(element => {
                element.won = true;
            });
        }

        updateFormD.winners = won == 1 ? updatedHomePlayersData : updatedAwayPlayersData;
        updateFormD.losers = won == 1 ? updatedAwayPlayersData : updatedHomePlayersData;

        setFormD(updateFormD);

        submitFunction(won == 1 ? homeTeam.teamID : awayTeam.teamID, updateFormD);
    };

    function convertMS(timeString) {

        const arr = timeString.split(":");
        const seconds = arr[0] * 60 + (+arr[1]);
        return seconds;

    };

    const RenderTeamImageLayoutFill = (t) => {

        const imagePath = process.env.NEXT_PUBLIC_BASE_API_URL + "/team-service/images/" + t?.teamLogoPath;
        return <Image loading={"eager"} height={20} width={20} alt={t?.teamName} title={t?.teamName} src={t?.teamLogoPath != null ? imagePath : "/images/teamBadge.png"} className="" draggable={false}></Image>;
    };

    const updateBannedGod = (banNumber, god) => {
        let bannedGodsList = formD.bannedGods;
        let bannedGod = bannedGodsList[banNumber - 1];
        bannedGod.godId = god.godId;
        bannedGod.godName = god.godName;
        bannedGod.godIcon = god.godIcon;
        bannedGodsList[banNumber - 1] = bannedGod;
        setFormD({...formD, bannedGods: bannedGodsList});
    };

    const BanWithTeamImage = (banNumber, phase) => {
        return (<>
            <div className="position-relative mt-3 mr-lg-2 mr-1">
                <div className="position-relative">
                    <NavDropdown className="imagedrop" id="god-dropdown" title={<Image loading={"eager"} width={30} height={30} src={formD?.bannedGods[banNumber - 1]?.godIcon != null ? formD?.bannedGods[banNumber - 1]?.godIcon : "/images/empty_slot.png"} alt={formD?.bannedGods[banNumber - 1]?.godName} title={formD?.bannedGods[banNumber - 1]?.godName} className="GodImg rounded" draggable={false} />}>
                        <Form.Control className="mx-auto mt-0 w-100" type="text" value={SearchValue} onChange={searchChange} placeholder={"god name"} />
                        {GodsMatched.length > 0 ? GodsMatched.map((g, index) => (
                            <NavDropdown.Item onClick={() => {updateBannedGod(banNumber, { godId: g?.id, godName: g?.name, godIcon: g?.godIcon_URL })}} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                <Image className="mr-1" loader={imageLoader} width={30} height={30} src={g?.godIcon_URL} draggable={false} />
                                {g?.name}
                            </NavDropdown.Item>
                        )) : <></>}
                    </NavDropdown>
                </div>
                <div className="SmallTeamImg position-absolute">{RenderTeamImageLayoutFill(phase == 2 ? (banNumber % 2 ? awayTeam : homeTeam) : (banNumber % 2 ? homeTeam : awayTeam))}</div>
            </div>
        </>);
    };

    return (
        <>
            <Row className="mb-2">
                <Col ><Form.Control ref={patchNumber} className="pl-1 pr-1" type="text" placeholder={"Patch number, e.g. 10.7"} required /></Col>
                <Col ><Form.Control ref={gameID} className="pl-1 pr-1" type="text" placeholder={"Match ID e.g. 1234567890"} required /></Col>
                <Col ><Form.Control ref={matchDuration} className="pl-1 pr-1" type="text" placeholder={"Match time, e.g. 20:59"} required /></Col>
            </Row>
            <Row className="mb-3">
                <Col md={7} className="mx-auto rounded alert-secondary border">
                    <Row className="justify-content-center mt-2">
                        <Col xl={7} lg={7} xs={7} className="pb-1">
                            <Row><Col md={12} className="text-left border-right border-secondary"><h6 className="font-weight-bold">1st ban phase</h6></Col></Row>
                            <Row>
                                <Col md={12} className="d-flex border-right border-secondary">
                                    <div className="d-flex align-items-center justify-content-left">
                                        {BanWithTeamImage(1, 1)}
                                        {BanWithTeamImage(2, 1)}
                                        {BanWithTeamImage(3, 1)}
                                        {BanWithTeamImage(4, 1)}
                                        {BanWithTeamImage(5, 1)}
                                        {BanWithTeamImage(6, 1)}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={5} lg={5} xs={5} className="pb-1">
                            <Row><Col md={12} className="text-left"><h6 className="font-weight-bold">2nd ban phase</h6></Col></Row>
                            <Row>
                                <Col md={12} className="d-flex">
                                    <div className="d-flex align-items-center justify-content-left">
                                        {BanWithTeamImage(7, 2)}
                                        {BanWithTeamImage(8, 2)}
                                        {BanWithTeamImage(9, 2)}
                                        {BanWithTeamImage(10, 2)}
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                            {RenderTeamImage(homeTeam)}
                            <Link href={`/stats/team/${homeTeam.teamID}`}><a className="link-unstyled my-auto"><h4 className="font-weight-bold my-auto ml-1 Clickable Hoverable" title={"click to see team stats"}>{homeTeam?.teamName}</h4></a></Link>
                            <Form.Check checked={won == 1} onChange={() => { setWon(won == 1 ? 2 : 1); }} id="switch-home" type="switch" className="ml-2 my-auto" label="Team won"
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-1">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table variant="" className="rounded-bottom text-center" id="TeamTable">
                        <thead className="">
                            <tr className={won == 1 ? "bg-success" : "bg-danger"}>
                                <th>God</th>
                                <th className="">Player</th>
                                <th className="KDAPadding">K/D/A</th>
                                <th>DMG</th>
                                <th>Taken</th>
                                <th>Mitigated</th>
                                <th>Gold</th>
                                <th>GPM</th>
                                <th>Relics</th>
                                <th>Build</th>
                            </tr>
                        </thead>
                        <tbody>{homeTeam.teamMembers.map((p, index) => (
                            <PlayerEntry imageLoader={imageLoader} key={index} listOfGods={listOfGods} listOfItems={listOfItems?.length > 0 ? listOfItems?.filter(x => x.activeFlag == "y") : []} playerInfo={p} index={index} won={won} winToggleNumber={1} data={homePlayersData} setPlayerData={setHomePlayersData} />
                        ))}</tbody>
                    </Table>
                </Col>
            </Row>

            {/* AwayTeam */}
            <Row className="mb-2">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Row>
                        <Col md={8} className="d-inline-flex">
                            {RenderTeamImage(awayTeam)}
                            <Link href={`/stats/team/${awayTeam.teamID}`}><a className="link-unstyled my-auto"><h4 className="font-weight-bold my-auto ml-1 Clickable Hoverable" title={"click to see team stats"}>{awayTeam?.teamName}</h4></a></Link>
                            <Form.Check checked={won == 2} onChange={() => { setWon(won == 2 ? 1 : 2); }} id="switch-away" type="switch" className="ml-2 my-auto" label="Team won" />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mb-1">
                <Col xl={12} md={12} xs={12} className="mx-auto">
                    <Table variant="" className="rounded-bottom text-center" id="TeamTable">
                        <thead className="">
                            <tr className={won == 2 ? "bg-success" : "bg-danger"}>
                                <th>God</th>
                                <th className="">Player</th>
                                <th className="KDAPadding">K/D/A</th>
                                <th>DMG</th>
                                <th>Taken</th>
                                <th>Mitigated</th>
                                <th>Gold</th>
                                <th>GPM</th>
                                <th>Relics</th>
                                <th>Build</th>
                            </tr>
                        </thead>
                        <tbody>{awayTeam.teamMembers.map((p, index) => (
                            <PlayerEntry imageLoader={imageLoader} key={index} listOfGods={listOfGods} listOfItems={listOfItems?.length > 0 ? listOfItems?.filter(x => x.activeFlag == "y") : []} playerInfo={p} index={index} won={won} winToggleNumber={2} data={awayPlayersData} setPlayerData={setAwayPlayersData} />
                        ))}</tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col><Button disabled={disableButton} block onClick={submitMatchData}>Submit match data</Button></Col>
            </Row>
        </>
    );
}

export function PlayerEntry({ won, winToggleNumber, playerInfo, data, index, listOfGods, listOfItems, setPlayerData, imageLoader }) {

    const [thisPlayerData, setThisPlayerData] = useState(
        {
            ingameTeamID: winToggleNumber - 1,
            won: won == winToggleNumber,
            firstBanSide: won == winToggleNumber,
            playerIsFill: false,
            player: {
                playerID: playerInfo.playerID,
                playername: playerInfo.teamMemberName,
                platform: playerInfo.teamMemberPlatform
            },
            god: {
                godId: 0,
                godName: "string",
                godIcon: null
            },
            damageDealt: 0,
            damageTaken: 0,
            damageMitigated: 0,
            kills: 0,
            deaths: 0,
            assists: 0,
            level: 0,
            goldEarned: 0,
            gpm: 0,
            healing: 0,
            relic1ID: 0,
            relic2ID: 0,
            relic1Icon: null,
            relic2Icon: null,
            relic1Name: null,
            relic2Name: null,
            item1ID: 0,
            item2ID: 0,
            item3ID: 0,
            item4ID: 0,
            item5ID: 0,
            item6ID: 0,
            item1Icon: null,
            item2Icon: null,
            item3Icon: null,
            item4Icon: null,
            item5Icon: null,
            item6Icon: null,
            item1Name: null,
            item2Name: null,
            item3Name: null,
            item4Name: null,
            item5Name: null,
            item6Name: null,
            fireGiantsKilled: 0,
            goldFuriesKilled: 0,
            killingSpree: 0,
            firstBlood: false,
            towersDestroyed: 0,
            phoenixesDestroyed: 0,
            wardsPlaced: 0,
            structureDamage: 0,
            minionDamage: 0,
            distanceTravelled: 0,
            region: "string",
            highestMultiKill: 0,
            objectiveAssists: 0,
            timeSpentDeathInSeconds: 0,
            pentas: 0,
            quadras: 0,
            triples: 0,
            doubles: 0
        });

    //   Update win status
    useEffect(() => {
        setThisPlayerData({ ...thisPlayerData, won: won == winToggleNumber ? true : false });
    }, [won]);


    // Update parent objects that are used for submission
    // useEffect(() => {
    //     updateParentState();
    // },[thisPlayerData]);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateParentState();
        }, 250);

        return () => clearTimeout(timer);
    }, [thisPlayerData])

    const updateParentState = () => {
        let mutateState = [...data];
        let item = thisPlayerData;
        item.won = won == winToggleNumber ? true : false;
        item.kills = (Number)(thisPlayerData?.kills);
        item.damageDealt = (Number)(thisPlayerData?.damageDealt);
        item.damageTaken = (Number)(thisPlayerData?.damageTaken);
        item.damageMitigated = (Number)(thisPlayerData?.damageMitigated);
        item.deaths = (Number)(thisPlayerData?.deaths);
        item.assists = (Number)(thisPlayerData?.assists);
        item.level = (Number)(thisPlayerData?.level);
        item.goldEarned = (Number)(thisPlayerData?.goldEarned);
        item.gpm = (Number)(thisPlayerData?.gpm);
        item.healing = (Number)(thisPlayerData?.healing);
        item.wardsPlaced = (Number)(thisPlayerData?.wardsPlaced);
        item.structureDamage = (Number)(thisPlayerData?.structureDamage);
        mutateState[index] = item;
        setPlayerData(mutateState);
    };

    //#region godSearch
    const [GodsMatched, setGodsMatched] = useState([]);
    const [SearchValue, setSearchValue] = useState("");

    const searchChange = (evt) => {
        setSearchValue(evt.target.value);

        if (evt.target.value?.length > 0) {
            setGodsMatched(listOfGods.filter(g =>
                g.name?.toLowerCase().includes(evt.target.value.toLowerCase())
            ));
        }
        else {
            setGodsMatched(listOfGods);
        }
    };

    useEffect(() => {
        setGodsMatched(listOfGods);
    }, [listOfGods]);
    //#endregion

    //#region godSearch
    const [ItemsMatched, setItemsMatched] = useState([]);
    const [ItemSearchValue, setItemSearchValue] = useState("");

    const searchItemChange = (evt) => {
        setItemSearchValue(evt.target.value);

        if (evt.target.value?.length > 0) {
            setItemsMatched(listOfItems.filter(i =>
                i.deviceName?.toLowerCase().includes(evt.target.value.toLowerCase())
            ));
        }
        else {
            setItemsMatched(listOfItems);
        }
    };

    useEffect(() => {
        setItemsMatched(listOfItems);
    }, [listOfItems]);
    //#endregion


    return (
        <>
            <tr className={won == winToggleNumber ? index % 2 ? "table-success2" : "table-success" : index % 2 ? "table-danger2" : "table-danger"}>
                <td className="align-items-center justify-content-center">
                    <NavDropdown className="imagedrop" id="god-dropdown" title={data[index]?.god?.godIcon != null ? <Image loader={imageLoader} className="GodImg rounded" width={30} height={30} src={data[index]?.god?.godIcon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="GodImg rounded" draggable={false} />}>
                        <Form.Control className="mx-auto mt-0 w-100" type="text" value={SearchValue} onChange={searchChange} placeholder={"god name"} />
                        {GodsMatched.length > 0 ? GodsMatched.map((g, index) => (
                            <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, god: { godId: g?.id, godName: g?.name, godIcon: g?.godIcon_URL } }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                <Image className="mr-1" loader={imageLoader} width={30} height={30} src={g?.godIcon_URL} draggable={false} />
                                {g?.name}
                            </NavDropdown.Item>
                        )) : <></>}
                    </NavDropdown>
                </td>
                <td className=""><div className="d-flex align-items-center text-left"><Img webp src={require("public/images/roles/" + playerInfo?.teamMemberRole?.roleName + "_Logo.png")} title={playerInfo?.teamMemberRole?.roleName} alt={playerInfo?.teamMemberRole?.roleName} height={15} width={15} className="mr-1 my-auto" draggable={false} />
                    {playerInfo?.teamMemberID != null && playerInfo?.teamMemberID != 0 ? <Link href={`/stats/player/${playerInfo?.teamMemberID}`}><span className="Clickable Hoverable" title={"click to see player stats"}>{playerInfo?.teamMemberName}</span></Link> : <span>{playerInfo?.teamMemberName}</span>}</div></td>
                <td>
                    <Row>
                        <Col className="pr-1"><Form.Control value={thisPlayerData?.kills} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, kills: e?.target?.value }) }} className="pl-1 pr-1" type="text" pattern="[0-9]+" placeholder={"0"} required /></Col>
                        <Col className="pl-1 pr-1"><Form.Control value={thisPlayerData?.deaths} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, deaths: e?.target?.value }) }} className="pl-1 pr-1" type="text" pattern="[0-9]+" placeholder={"0"} required /></Col>
                        <Col className="pl-1"><Form.Control value={thisPlayerData?.assists} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, assists: e?.target?.value }) }} className="pl-1 pr-1" type="text" pattern="[0-9]+" placeholder={"0"} required /></Col>
                    </Row>
                </td>
                <td>
                    <Row>
                        <Col><Form.Control value={thisPlayerData?.damageDealt} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, damageDealt: e?.target?.value }) }} className="pl-1 pr-1" type="number" placeholder={"0"} required /></Col>
                    </Row>
                </td>
                <td>
                    <Row>
                        <Col><Form.Control value={thisPlayerData?.damageTaken} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, damageTaken: e?.target?.value }) }} className="pl-1 pr-1" type="number" placeholder={"0"} required /></Col>
                    </Row>
                </td>
                <td>
                    <Row>
                        <Col><Form.Control value={thisPlayerData?.damageMitigated} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, damageMitigated: e?.target?.value }) }} className="pl-1 pr-1" type="number" placeholder={"0"} required /></Col>
                    </Row>
                </td>
                <td>
                    <Row>
                        <Col><Form.Control value={thisPlayerData?.goldEarned} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, goldEarned: e?.target?.value }) }} className="pl-1 pr-1" type="number" placeholder={"0"} required /></Col>
                    </Row>
                </td>
                <td>
                    <Row>
                        <Col><Form.Control value={thisPlayerData?.gpm} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, gpm: e?.target?.value }) }} className="pl-1 pr-1" type="number" placeholder={"0"} required /></Col>
                    </Row>
                </td>
                <td className="">
                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="relic1-dropdown" title={data[index]?.relic1Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.relic1Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type == "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, relic1ID: i.itemId, relic1Icon: i.itemIcon_Url, relic1Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="relic2-dropdown" title={data[index]?.relic2Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.relic2Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type == "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, relic2ID: i.itemId, relic2Icon: i.itemIcon_Url, relic2Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                    </div>
                </td>
                <td className="">
                    <div className="d-flex align-items-center justify-content-center m-0 p-0">
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="item1-dropdown" title={data[index]?.item1Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.item1Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type != "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, item1ID: i.itemId, item1Icon: i.itemIcon_Url, item1Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="item2-dropdown" title={data[index]?.item2Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.item2Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type != "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, item2ID: i.itemId, item2Icon: i.itemIcon_Url, item2Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="item3-dropdown" title={data[index]?.item3Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.item3Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type != "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, item3ID: i.itemId, item3Icon: i.itemIcon_Url, item3Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="item4-dropdown" title={data[index]?.item4Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.item4Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type != "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, item4ID: i.itemId, item4Icon: i.itemIcon_Url, item4Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="item5-dropdown" title={data[index]?.item5Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.item5Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type != "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, item5ID: i.itemId, item5Icon: i.itemIcon_Url, item5Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                        <div className="ItemImg mr-1 position-relative">
                            <NavDropdown className="imagedrop" id="item6-dropdown" title={data[index]?.item6Icon != null ? <Image loader={imageLoader} className="ItemImg" width={30} height={30} src={data[index]?.item6Icon} draggable={false} /> : <Img webp src={require("public/images/empty_slot.png")} height={30} width={30} className="ItemImg" draggable={false} />}>
                                <Form.Control className="mx-auto mt-0 w-100" type="text" value={ItemSearchValue} onChange={searchItemChange} placeholder={"item name"} />
                                {ItemsMatched.length > 0 ? ItemsMatched.filter(x => x.type != "Active").map((i, index) => (
                                    <NavDropdown.Item onClick={() => { setThisPlayerData({ ...thisPlayerData, item6ID: i.itemId, item6Icon: i.itemIcon_Url, item6Name: i.deviceName }) }} className="d-flex align-items-center justify-content-left p-1" key={index}>
                                        <Image className="mr-1" loader={imageLoader} width={30} height={30} src={i?.itemIcon_Url} draggable={false} />
                                        {i?.deviceName}
                                    </NavDropdown.Item>
                                )) : <></>}
                            </NavDropdown>
                        </div>
                    </div>
                </td>
            </tr>
            <tr className={won == winToggleNumber ? index % 2 ? "table-success2" : "table-success" : index % 2 ? "table-danger2" : "table-danger"}>
                <td colSpan="10" className="text-left">
                    <Row>

                        <Col className="d-flex align-items-center">
                            <b className="ml-1">Level: </b>
                            <Form.Control value={thisPlayerData?.level} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, level: e?.target?.value }) }} className="pl-1 pr-1 w-25" type="number" placeholder={"0"} required />
                        </Col>
                        <Col className="d-flex align-items-center">
                            <b className="ml-1">Wards placed: </b>
                            <Form.Control value={thisPlayerData?.wardsPlaced} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, wardsPlaced: e?.target?.value }) }} className="pl-1 pr-1 w-25" type="number" placeholder={"0"} required />
                        </Col>
                        <Col className="d-flex align-items-center">
                            <b className="ml-1">Structure dmg: </b>
                            <Form.Control value={thisPlayerData?.structureDamage} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, structureDamage: e?.target?.value }) }} className="pl-1 pr-1 w-50" type="number" placeholder={"0"} required />
                        </Col>
                        <Col className="d-flex align-items-center">
                            <b className="ml-1">Healing: </b>
                            <Form.Control value={thisPlayerData?.healing} onChange={(e) => { setThisPlayerData({ ...thisPlayerData, healing: e?.target?.value }) }} className="pl-1 pr-1 w-50" type="number" placeholder={"0"} required />
                        </Col>
                    </Row>
                </td>
            </tr>
        </>
    );
}
