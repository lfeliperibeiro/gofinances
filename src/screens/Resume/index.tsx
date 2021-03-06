import React, { useCallback, useState } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
} from './styles';
import { HistoryCard } from '../../components/HistoryCard';
import { ActivityIndicator, AsyncStorage } from 'react-native';
import { categories } from '../../utils/categories';
import { VictoryPie } from 'victory-native';
import { addMonths, format, subMonths } from 'date-fns';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../global/styles/theme';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

type TransactionData = {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
};

type CategoryData = {
  key: string;
  name: string;
  total: number;
  totalFormated: string;
  percent: string;
  color: string;
};

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>(
    [],
  );

  const { user } = useAuth();

  function handleChangeDate(action: 'next' | 'previous') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectDate, 1));
    } else {
      setSelectedDate(subMonths(selectDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter(
      (expensive: TransactionData) =>
        expensive.type === 'negative' &&
        new Date(expensive.date).getMonth() === selectDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectDate.getUTCFullYear(),
    );

    const expensiveTotal = expensives.reduce(
      (acc: number, expensive: TransactionData) => {
        return acc + Number(expensive.amount);
      },
      0,
    );

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;
      expensives.forEach((expensive: TransactionData) => {
        if (expensive.category === category.key) {
          categorySum += Number(expensive.amount);
        }
      });
      if (categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        const percent = `${((categorySum / expensiveTotal) * 100).toFixed(0)}%`;

        totalByCategory.push({
          key: category.key,
          name: category.name,
          color: category.color,
          total: categorySum,
          totalFormated: total,
          percent,
        });
      }
    });
    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadData().then();
    }, [selectDate]),
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.secondary} size={'large'} />
        </LoadContainer>
      ) : (
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight(),
          }}
        >
          <MonthSelect>
            <MonthSelectButton onPress={() => handleChangeDate('previous')}>
              <MonthSelectIcon name={'chevron-left'} />
            </MonthSelectButton>
            <Month>{format(selectDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
            <MonthSelectButton onPress={() => handleChangeDate('next')}>
              <MonthSelectIcon name={'chevron-right'} />
            </MonthSelectButton>
          </MonthSelect>
          <ChartContainer>
            <VictoryPie
              data={totalByCategories}
              x={'percent'}
              y={'total'}
              colorScale={totalByCategories.map((categorie) => categorie.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape,
                },
              }}
              labelRadius={50}
            />
          </ChartContainer>
          {totalByCategories.map((item) => (
            <HistoryCard
              key={item.key}
              title={item.name}
              amount={item.totalFormated}
              color={item.color}
            />
          ))}
        </Content>
      )}
    </Container>
  );
}
