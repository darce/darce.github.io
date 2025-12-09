import React from 'react'
import type { ReactElement } from 'react'
import type { NextPageWithLayout } from './_app'
import { getMdxContent } from '../lib/getMdxContent'
import Layout from '../components/layout/Layout'
import styles from '../styles/resumePage.module.scss'

interface ResumeSection {
    [key: string]: string[] | ResumeSection
}

interface ResumeItem {
    position?: string,
    company?: string,
    'date-start'?: string,
    'date-end'?: string,
    description?: string[],
    [key: string]: any
}

interface ResumePageProps {
    resumeData: { metaData: ResumeSection }[]
}

const ResumePage: NextPageWithLayout<ResumePageProps> = ({ resumeData }) => {
    const resumeContent = resumeData[0]?.metaData

    const renderResumeValue = (value: string | string[] | ResumeItem | ResumeItem[]): React.ReactNode => {
        if (Array.isArray(value)) {
            return (
                <dl>
                    {value.map((item: string | ResumeItem, index) => (
                        <React.Fragment key={index}>
                            {typeof item === 'string' ? (
                                <dt>{item}</dt>
                            ) : (
                                renderResumeItem(item)
                            )}
                        </React.Fragment>
                    ))}
                </dl>
            )
        }

        if (typeof value === 'string') {
            return <dt>{value}</dt>
        }

        return renderResumeSection(value)
    }

    const renderResumeItem = (item: ResumeItem): React.ReactNode => {
        return (
            <> {
                item.position ? (
                    <>

                        <dt>{item.position}</dt>
                        <dd>
                            <p>{item.company}</p>
                            <p>{item['date-start']} - {item['date-end']}</p>
                            {item.description && renderDescription(item.description)}
                        </dd>
                    </>
                ) : (
                    <>
                        <dt>{item.school}</dt>
                        <dd>
                            <p>{item.title}</p>
                            <p>{item.details}</p>
                        </dd>
                    </>
                )
            }
            </>
        )
    }
    const renderDescription = (descriptions: string[]): React.ReactNode => (
        <ul>
            {descriptions.map((description, index) => (
                <li key={index}>{description}</li>
            ))}
        </ul>
    )

    const renderResumeSection = (section: ResumeSection): React.ReactNode => {
        return (
            <div className={styles.section}>
                {Object.entries(section)
                    .map(([key, value]) => (
                        <React.Fragment key={key}>
                            <h3>{key}</h3>
                            {renderResumeValue(value)}
                        </React.Fragment>
                    ))}
            </div>
        )
    }

    return (
        <main className={`content ${styles.resume}`}>
            <aside>
                <a href="/daniel_arce_resume_2024-q2.pdf">Download PDF</a>
            </aside>
            {resumeContent && renderResumeSection(resumeContent)}
        </main>
    )
}

ResumePage.getLayout = (page: ReactElement) => {
    return (
        <Layout>
            {page}
        </Layout>
    )
}

/** Call getStaticProps on build */
export const getStaticProps = async () => {
    const resumeProps = await getMdxContent({ subDir: 'resume' })
    const headerProps = await getMdxContent({ subDir: 'header' })

    return {
        props: {
            resumeData: resumeProps.parsedMdxArray,
            headerData: headerProps.parsedMdxArray,
        }
    }
}
export default ResumePage