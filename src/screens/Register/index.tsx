import React, { useState } from 'react';
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes,
} from './style';
import { Input } from '../../components/Form/Input/input';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Modal } from 'react-native';
import { CategorySelect } from '../CategorySelect';

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoyModalOpen, setCategoyModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Category',
  });

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleOpenSelectCategoryModal() {
    setCategoyModalOpen(true);
  }

  function handleCloseSelectCategoryModal() {
    setCategoyModalOpen(false);
  }
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input placeholder={'Nome'} />
          <Input placeholder={'Preço'} />
          <TransactionsTypes>
            <TransactionTypeButton
              type={'up'}
              title={'Income'}
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton
              type={'down'}
              title={'Outcome'}
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>
          <CategorySelectButton
            title={category.name}
            onPress={handleOpenSelectCategoryModal}
          />
        </Fields>
        <Button title={'Enviar'} />
      </Form>
      <Modal visible={categoyModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  );
}
