import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, message } from 'antd';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ButtonForm } from 'shared/ui';
import { useUser } from 'shared/hooks/use-user';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from 'firebase';
import style from './SignUpForm.module.scss';

export const defaultData = {
  tabSet: {
    activeKey: '1',
    tabs: [
      {
        label: 'Tab 1',
        query: { data: '', variables: '', headers: '' },
        response: { data: '', isLoading: false, error: undefined },
        key: '1',
        closable: false,
      },
    ],
  },
  commonSet: {
    isCache: 0,
    isStats: 1,
  },
};

const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatchUser = useUser();

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [submittable, setSubmittable] = React.useState(false);

  const enteredValues = Form.useWatch([], form);

  React.useEffect(() => {
    if (form.isFieldsTouched(true)) {
      form.validateFields(['email', 'password', 'confirm']).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
    }
  }, [form, enteredValues]);

  const isConfirm = (value: string, password: string) => {
    if (!value || password === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(`${t('form.error.notMatchingPsw')}`));
  };

  const onFinish = (values: ILoginData) => {
    const { email: emailValues, password } = values;
    messageApi.open({
      key: 'updatable',
      type: 'loading',
      content: `${t('loader')}`,
    });

    createUserWithEmailAndPassword(auth, emailValues, password)
      .then(async ({ user }) => {
        const { email, uid, accessToken } = user as unknown as UserFirebase;
        dispatchUser({ email, id: uid, token: accessToken });

        // TODO: вынести в отдельную функцию
        await setDoc(doc(db, 'settings', uid), {
          name: 'sf',
        });
      })
      .catch((error) => {
        messageApi.open({
          key: 'updatable',
          type: 'error',
          content: error.message,
        });
      });
  };

  return (
    <>
      {contextHolder}
      <Form
        name="signup"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        form={form}
      >
        <Form.Item
          name="email"
          label={t('form.fields.email')}
          rules={[
            {
              type: 'email',
              message: `${t('form.error.invalidMail')}`,
            },
            {
              required: true,
              message: `${t('form.error.emptyMail')}`,
            },
          ]}
          hasFeedback
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          label={t('form.fields.password')}
          rules={[
            {
              required: true,
              message: `${t('form.error.emptyPsw')}`,
            },
            {
              pattern:
                /* eslint-disable-next-line */
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\[\]"\';:_\-<>\., =\+\/\\]).{8,}$/,
              message: `${t('form.error.invalidPsw')}`,
            },
          ]}
          hasFeedback
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item
          name="confirm"
          label={t('form.fields.confirmPsw')}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: `${t('form.error.confirmPsw')}`,
            },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                isConfirm(value, getFieldValue('password')),
            }),
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>
        <Form.Item shouldUpdate>
          {() => (
            <ButtonForm
              text={t('button.access')}
              className={style.button}
              isDisabled={!submittable}
            />
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUpForm;
