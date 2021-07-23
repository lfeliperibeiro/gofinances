import React, { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transacions,
  Title,
  TransactionsList,
  LogoutButton,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, Data } from '../../components/TransactionCard';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export interface DataListProps extends Data {
  id: string;
}

export function Dashboard() {
  const [data, setData] = useState<DataListProps[]>([]);

  async function loadingTransaction() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    const transactionFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(new Date(item.date));
        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      },
    );
    setData(transactionFormatted);
  }

  useEffect(() => {
    loadingTransaction();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadingTransaction();
    }, []),
  );
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: 'https://avatars.githubusercontent.com/u/53883371?v=4',
              }}
            />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Felipe</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => {}}>
            <Icon name={'power'} />
          </LogoutButton>
        </UserWrapper>
      </Header>
      <HighlightCards>
        <HighlightCard
          type={'up'}
          title={'Entradas'}
          amount={'R$ 17.400,00'}
          lastTransaction={'Última entrada dia 13 de abril'}
        />
        <HighlightCard
          type={'down'}
          title={'Saídas'}
          amount={'R$ 17.400,00'}
          lastTransaction={'Última entrada dia 13 de abril'}
        />
        <HighlightCard
          type={'total'}
          title={'Total'}
          amount={'R$ 17.400,00'}
          lastTransaction={'Última entrada dia 13 de abril'}
        />
      </HighlightCards>
      <Transacions>
        <Title>Listagem</Title>
        <TransactionsList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transacions>
    </Container>
  );
}
