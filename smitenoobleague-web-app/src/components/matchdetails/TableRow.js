

export default function TableRow({player}) {

    return (
<tr className={index%2 ? "table-success2" : "table-success"}>
<td><Image width={30} height={30} src={player?.god?.godIcon} alt="" className="GodImg rounded" draggable={false}/></td>
    <td className="text-left"><div className=" d-flex align-items-center"><Img src={require("public/images/roles/" + player?.role.roleName + "_Logo.png")}  height={15} width={15} className="mr-1 my-auto"/> {player?.player?.playername}</div></td>
    <td>{player?.kills}/{player?.deaths}/{player?.assists}</td>
    <td>{player?.damageDealt}</td>
    <td>{player?.damageTaken}</td>
    <td>{player?.damageMitigated}</td>
    <td>{player?.goldEarned}</td>
    <td>{player?.gpm}</td>
    <td className="">
        <div className="d-flex align-items-center justify-content-center m-0 p-0">
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.relic1Icon != null ? player?.relic1Icon : "/images/empty_slot.png"} draggable={false}/></div>
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.relic2Icon != null ? player?.relic2Icon : "/images/empty_slot.png"} draggable={false}/></div>
        </div>
    </td>
    <td className="">
        <div className="d-flex align-items-center justify-content-center m-0 p-0">
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item1Icon != null ? player?.item1Icon : "/images/empty_slot.png"} draggable={false}/></div>
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item2Icon != null ? player?.item2Icon : "/images/empty_slot.png"} draggable={false}/></div>
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item3Icon != null ? player?.item3Icon : "/images/empty_slot.png"} draggable={false}/></div>
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item4Icon != null ? player?.item4Icon : "/images/empty_slot.png"} draggable={false}/></div>
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item5Icon != null ? player?.item5Icon : "/images/empty_slot.png"} draggable={false}/></div>
            <div className="ItemImg mr-1 position-relative"><Image layout={"fill"} src={player?.item6Icon != null ? player?.item6Icon : "/images/empty_slot.png"} draggable={false}/></div>
        </div>
    </td>
</tr>
    );
}