import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

function findAndAppendSubGroups(all, metadata, baseUrl, subItems) {
  subItems.forEach(sub => {
    if (typeof sub === 'string') {
      const label = metadata.docs[sub];
      if (label) {
        all.push({
          label,
          key: baseUrl + 'docs/' + sub
        });
      }
    } else if (sub.items) {
      findAndAppendSubGroups(all, metadata, baseUrl, sub.items);
    }
  });
}

function getToc(sidebars, metadata, baseUrl) {
  const out = [];
  const docs = sidebars.docs;
  Object.keys(docs).forEach(categoryKey => {
    const allSubGroups = [];
    findAndAppendSubGroups(allSubGroups, metadata, baseUrl, docs[categoryKey]);
    const description = metadata.categories[categoryKey];
    if (description) {
      out.push({
        key: categoryKey,
        description,
        subGroups: allSubGroups
      });
    }
  });
  return out;
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const { baseUrl } = siteConfig;
  const { sidebars, metadata } = siteConfig.customFields;
  const toc = getToc(sidebars, metadata, baseUrl);
  const title = siteConfig.title + ' 中文文档';
  return (
    <Layout title="中文文档" description={title}>
      <header className={classnames('hero', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className="text-xs text-gray">
            该文档为{siteConfig.title}
            版本的帮助文档，如果需要其它Rancher产品的文档请点击导航栏中的“文档中心”
          </div>
        </div>
      </header>
      <main>
        <div className={classnames(styles.tocContainer, styles.wrapper)}>
          <ul className={styles.sectionList}>
            {toc.map(group => {
              const sectionTitleUrl = group.subGroups[0]
                ? group.subGroups[0].key
                : baseUrl;
              return (
                <li key={group.key}>
                  <h3>
                    <a href={sectionTitleUrl}>{group.key}</a>
                  </h3>
                  <span className="text-xs text-grey">{group.description}</span>
                  <ul className={styles.subGroupList}>
                    {group.subGroups.map((subGroup, index) => {
                      return (
                        <li key={subGroup.key}>
                          <a href={subGroup.key}>{subGroup.label}</a>
                          {(() => {
                            if (
                              siteConfig.customFields.stable === subGroup.label
                            ) {
                              return (
                                <span className={styles.stable}>稳定版</span>
                              );
                            }
                            if ('版本说明' === group.key && index === 0) {
                              return (
                                <span className={styles.latest}>最新版</span>
                              );
                            }
                            if ('产品介绍' === group.key && index === 0) {
                              return <span className={styles.vedio}>视频</span>;
                            }
                          })()}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
