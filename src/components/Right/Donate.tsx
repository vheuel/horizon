import { SyntheticEvent, useState } from 'react';
import { Portal } from 'react-portal';

export default function Donate(props: {}) {
    const items = ["Coffee 🍵","Beer 🍺","Cake 🍰","Peach 🍑","Eggplant 🍆","Pizza 🍕"];
    const [item,setItem] = useState(items[Math.floor(Math.random() * (items.length))]);
    const [modalOpen,setModalOpen] = useState(false);

    const _handleClick = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setModalOpen(true);
    }
    
    const _handleCloseModal = (e:SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setModalOpen(false);
    }

    return (
        <>
        <a href="#" title="" target="_self" className="donate-btn" onClick={_handleClick}>Donate Me A {item}!</a>
        {modalOpen ? 
            <Portal>
                <div className="modal">
                    <div className="modal-backdrop" onClick={_handleCloseModal}></div>
                    <div className="modal-content">
                        <h1>🪙 Donation</h1>
                        <p>Developing Horizon takes quite some time from my daily life so I'd really appreciate any help if you'd like to support a passionate developer :) </p>
                        <div className="donation-uri">
                            <strong>ko-fi: </strong>
                            <span><a href="http://ko-fi.com/vheuel">@vheuel</a></span>
                        </div>
                        <div className="donation-uri">
                            <strong>Patreon: </strong>
                            <span><a href="http://patreon.com/vheuel">@vheuel</a></span>
                        </div>
                        <div className="donation-uri">
                            <strong>Dogecoin: </strong>
                            <span>DGXjAN3wz3XLky3Uxd3rQyGhQTYxk4ctg5</span>
                        </div>
                    </div>
                </div>
            </Portal>
        : ''}
        </>
    );
}