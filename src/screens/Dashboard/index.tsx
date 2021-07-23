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
  LoadContainer,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, Data } from '../../components/TransactionCard';
import { ActivityIndicator, AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';

export interface DataListProps extends Data {
  id: string;
}

interface HighligtProps {
  amount: string;
}

interface HighlightData {
  entries: HighligtProps;
  expensive: HighligtProps;
  total: HighligtProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData,
  );

  const theme = useTheme();
  async function loadingTransaction() {
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entrieTotal = 0;
    let expensiveTotal = 0;

    const transactionFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === 'positive') {
          entrieTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }
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
    setTransactions(transactionFormatted);
    const total = entrieTotal - expensiveTotal;
    setHighlightData({
      entries: {
        amount: entrieTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
      expensive: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
      },
    });
    setIsLoading(false);
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
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size={'large'} />
        </LoadContainer>
      ) : (
        <>
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
              amount={highlightData.entries.amount}
              lastTransaction={'Última entrada dia 13 de abril'}
            />
            <HighlightCard
              type={'down'}
              title={'Saídas'}
              amount={highlightData.expensive.amount}
              lastTransaction={'Última entrada dia 13 de abril'}
            />
            <HighlightCard
              type={'total'}
              title={'Total'}
              amount={highlightData.total.amount}
              lastTransaction={'Última entrada dia 13 de abril'}
            />
          </HighlightCards>
          <Transacions>
            <Title>Listagem</Title>
            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transacions>
        </>
      )}
    </Container>
  );
}
