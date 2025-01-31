import React, { useId, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { LeftPointArrow } from "@/assets/icons";
import {
  Card,
  CardCvcInput,
  CardExpireDateInput,
  CardNameModal,
  CardNumberInput,
  CardOwnerInput,
  CardPasswordInput,
} from "@/components/cards";
import { useCardCvcInput } from "@/components/cards/CardCvcInput/hook";
import { useCardExpireDateInput } from "@/components/cards/CardExpireDateInput/hook";
import { useCardNameModal } from "@/components/cards/CardNameModal/hook";
import { useCardNumberInput } from "@/components/cards/CardNumberInput/hook";
import { useCardOwnerInput } from "@/components/cards/CardOwnerInput/hook";
import { useCardPasswordInput } from "@/components/cards/CardPasswordInput/hook";
import { Button } from "@/components/common";
import { useCardsContext } from "@/contexts";
import type { CardItem } from "@/contexts/CardsContext";
import { CardPageLayout } from "@/layouts/cards";
import { domains } from "@/router";

import * as S from "./addCard.style";

function HeaderLeftPointArrow() {
  const navigate = useNavigate();

  const handleMoveToCardsPage = () => {
    navigate(domains.CARD_LIST);
  };

  return <LeftPointArrow onClick={handleMoveToCardsPage} />;
}

export default function AddCard() {
  const uuid = useId();
  const navigate = useNavigate();

  const { dispatch } = useCardsContext();

  // 카드번호
  const { cardNumber, isValidCardNumber, onCardNumberChange } =
    useCardNumberInput({
      num1: "",
      num2: "",
      num3: "",
      num4: "",
    });

  // 카드 만료일
  const { cardExpireDate, isValidExpireDate, onCardExpireDateChange } =
    useCardExpireDateInput({
      month: "",
      year: "",
    });

  // 카드 소유주
  const { cardOwnerName, isValidOwnerName, onCardOwnerNameChange } =
    useCardOwnerInput({
      ownerName: "",
    });

  // 카드 CVC
  const { cvcNumber, isValidCvcNumber, onCvcNumberChange } = useCardCvcInput({
    cvc: "",
  });

  // 카드 비밀번호
  const { cardPassword, isPasswordValid, onCardPasswordChange } =
    useCardPasswordInput({
      password1: "",
      password2: "",
    });

  // 카드 이름
  const {
    cardNameList,
    selectedCardName,
    isCardNameModalShow,
    onCardNameSelect,
    onCardNameModalOpen,
  } = useCardNameModal(true);

  const cardExpireDateWithSlash = useMemo(
    () =>
      Object.entries(cardExpireDate)
        .map(([_, value]) => value)
        .filter((data) => data !== "")
        .join("/"),
    [cardExpireDate]
  );

  const cardNumberWithDash = useMemo(
    () =>
      Object.entries(cardNumber)
        .map(([_, value]) => value)
        .filter((number) => number !== "")
        .join("-"),
    [cardNumber]
  );

  const cardInfo = useMemo(
    () => ({
      cardName: selectedCardName.name ?? "",
      cardNumber: cardNumberWithDash,
      cardOwnerName: cardOwnerName.ownerName || "NAME",
      expireDate: cardExpireDateWithSlash || "MM/YY",
    }),
    [cardNumber, cardExpireDate, cardOwnerName, selectedCardName]
  );

  const checkSubmittable = () => {
    return [
      isValidCardNumber,
      isValidExpireDate,
      isValidOwnerName,
      isValidCvcNumber,
      isPasswordValid,
    ].every((value) => value);
  };

  const handleMoveToCompleteAddPage = () => {
    const isSubmittable = checkSubmittable();

    if (isSubmittable) {
      const cardItem: CardItem = {
        id: uuid,
        ...cardInfo,
        color: selectedCardName?.color,
      };

      dispatch({ type: "ADD_CARD", payload: cardItem });

      navigate(domains.CARD_COMPLETE, {
        state: {
          cardInfo: cardItem,
        },
      });
    }
  };

  const HeaderStartDecorator = useMemo(() => <HeaderLeftPointArrow />, []);

  return (
    <CardPageLayout>
      <S.AddCardPageHeader startDecorator={HeaderStartDecorator}>
        카드추가
      </S.AddCardPageHeader>
      <S.AddCardForm>
        <Card
          className="add-form-card"
          size="small"
          color={selectedCardName.color}
          cardInfo={cardInfo}
          onClick={onCardNameModalOpen}
        />
        <S.AddCardFormInputWrapper>
          <CardNumberInput
            cardNumber={cardNumber}
            onChange={onCardNumberChange}
          />
          <CardExpireDateInput
            cardExpireDate={cardExpireDate}
            onChange={onCardExpireDateChange}
          />
          <CardOwnerInput
            cardOwnerName={cardOwnerName.ownerName}
            onChange={onCardOwnerNameChange}
          />
          <CardCvcInput cardCvc={cvcNumber.cvc} onChange={onCvcNumberChange} />
          <CardPasswordInput
            cardPassword={cardPassword}
            onChange={onCardPasswordChange}
          />
        </S.AddCardFormInputWrapper>
      </S.AddCardForm>
      <S.AddCardFormSubmitButtonWrapper>
        <Button variant="text" onClick={handleMoveToCompleteAddPage}>
          다음
        </Button>
      </S.AddCardFormSubmitButtonWrapper>
      <CardNameModal
        isShow={isCardNameModalShow}
        onCardNameSelect={onCardNameSelect}
        cardNameList={cardNameList}
      />
    </CardPageLayout>
  );
}
