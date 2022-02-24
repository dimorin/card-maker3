import React, { useEffect, useState, useCallback } from 'react';
import styles from './maker.module.css';
import Header from '../header/header';
import Preview from '../preview/preview';
import Footer from '../footer/footer';
import { useNavigate, useLocation } from 'react-router-dom';
import Editor from '../editor/editor';

const Maker = ({FileInput, authService, cardRepository}) => {
    const historyState = useLocation().state;
    const [cards,setCards] = useState({});
    const [userId, setUserId] = useState(historyState && historyState.id);
    const navigate = useNavigate();
    const onLogout = useCallback(() => { // maker 컴포넌트가 렌더링 되어도 다시 onLogout 함수를 만들지 않기 위함
        authService.logout();
    }, [authService]);
    useEffect(() => {
        if(!userId){
            return;
        }
        const stopRead = cardRepository.readCards(userId, cards => {
            setCards(cards);
        });
        return () => stopRead(); // unmount 될 때는 읽어오는 것을 중지
    }, [cardRepository, userId]);
    useEffect(() => {
        authService.onAuthChange(user => {
            if(user){
                setUserId(user.uid)
            }else{
                navigate('/');
            }
        })
    },[authService, navigate]);
    
    const changeCard = (card) => {        
        setCards(cards => {
            const updated = {...cards};
            updated[card.id] = card;
            return updated;
        });
        cardRepository.saveCard(userId, card);
    }
    const deleteCard = (card) => {
        setCards(cards => {
            const updated = {...cards};
            delete updated[card.id];
            return updated;
        });
        cardRepository.removeCard(userId, card);
    }
    return (
        <section className={styles.maker}>
            <Header onLogout={onLogout} />
            <div className={styles.container}>
                <Editor FileInput={FileInput} cards={cards} addCard={changeCard} updateCard={changeCard} deleteCard={deleteCard} />
                <Preview cards={cards} />
            </div>
            <Footer />
        </section>
    )
};

export default Maker;