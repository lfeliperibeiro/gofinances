import React from 'react';

import {
  Container,
  Header,
  Title,
  Icon,
  Content,
  Amount,
  LastTransation,
} from './style';
export function HighlightCard() {
  return (
    <Container>
      <Header>
        <Title>Entrada</Title>
        <Icon name={'arrow-up-circle'} />
      </Header>
      <Content>
        <Amount>R$ 17.400,00</Amount>
        <LastTransation>Última entrada dia 13 de abril</LastTransation>
      </Content>
    </Container>
  );
}
