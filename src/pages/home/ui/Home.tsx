import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from 'shared/hoc';
import Intro from './Intro/Intro';
import styles from './Home.module.scss';
import DevSection from './Developers/DevSection';
import Description from './Description/Description';

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t('pageTitle.home')}</title>
      </Helmet>
      <ErrorBoundary type="page">
        <div className={styles.content}>
          <Intro />
          <Description />
          <DevSection />
        </div>
      </ErrorBoundary>
    </>
  );
};

export default Home;
