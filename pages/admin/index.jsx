import { useState } from 'react'
import { useRouter } from 'next/router'
import { Row, Col, Tooltip, Table } from 'antd'

import Chart from 'chart.js'
import Card from 'react-bootstrap/Card'

import { withAuth } from 'lib/withAuth'
import { chartOptions, parseOptions } from 'components/Chart/chart-pro'
import StatisticChart from 'components/Chart/Admin/Statistic'
import SoldProductChart from 'components/Chart/Admin/SoldProduct'
import ModalDetailReview from 'components/Modal/Admin/DetailReview'

import { dataSourceBestProduct, columnsBestProduct } from 'data/salesAdmin'
import { columnsReviewDashboard, dataSourceReview } from 'data/reviewAdmin'
import { formContentReview } from 'formdata/formReviewAdmin'

const statsData = [
  { 
    title: "Belum Bayar", 
    value: 0, 
    link: "/admin/sale?type=unpaid",
    tooltipText: <span className="fs-12">Pesanan yang baru masuk dan belum dibayar.</span> 
  },
  { 
    title: "Perlu Dikirim", 
    value: 0, 
    link: "/admin/sale?type=toship",
    tooltipText: <span className="fs-12">Pesanan yang sudah dibayar dan belum dikirim ke pembeli.</span>
  },
  { 
    title: "Konfirmasi Pembatalan", 
    value: 0, 
    link: "/admin/sale?type=canceled",
    tooltipText: <span className="fs-12">Pesanan yang perlu dikonfirmasi untuk dibatalkan.</span>
  },
  { 
    title: "Ulasan Baru", 
    value: 0, 
    link: "/admin",
    tooltipText: <span className="fs-12">Jumlah ulasan dari pembeli yang belum kamu balas.</span>
  },
]

parseOptions(Chart, chartOptions());

const Dashboard = () => {
  const router = useRouter()
  const [showDetailReview, setShowDetailReview] = useState(false)
  const [contentReview, setContentReview] = useState(formContentReview)

  const onClickReviewRow = (record) => {
    setContentReview(record)
    setShowDetailReview(true)
  }

  const onCloseModalDetailReview = () => {
    setShowDetailReview(false)
  }

  return(
    <>
      <section className="dashboard-section">
        <div className="dashboard-container">
          <h4 className="fs-20-s mb-0">Penting hari ini</h4>
          <p className="fs-14 fs-12-s text-secondary">Aktivitas yang perlu kamu pantau untuk jaga kepuasan pembeli</p>

          <Row gutter={[16, 16]}>
            {statsData.map((data, i) => (
              <Col xl={6} lg={8} md={8} sm={12} xs={12} key={i}>
                <Card className="shadow-sm h-100 hover-pointer border-0 bor-rad-5px" onClick={() => router.push(data.link)}>
                  <Card.Body className="py-2 px-3">
                    <p className="fs-14 text-secondary fs-12-s">
                      <span className="pr-1">{data.title}</span>
                      <Tooltip placement="bottom" title={data.tooltipText}>
                        <i className="far fa-info-circle" />
                      </Tooltip>
                    </p>
                  </Card.Body>
                  <Card.Footer className="pt-0 pb-3 px-3 bg-white border-0 bor-rad-5px">
                    <h3 className="align-self-center fs-22-s mb-0">{data.value}</h3>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="dashboard-container">
          <Row gutter={[16, 16]}>
            <Col lg={16} md={14} sm={12} xs={24}>
              <Card className="shadow-sm border-0 bor-rad-5px">
                <Card.Header className="bg-transparent">
                  <p className="text-uppercase mb-1 fs-12 text-secondary">Overview</p>
                  <h6 className="mb-0">Statistik Penjualan</h6>
                </Card.Header>
                <Card.Body>
                  <div className="h-350 position-relative">
                    <StatisticChart />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={8} md={10} sm={12} xs={24}>
              <Card className="shadow-sm border-0 bor-rad-5px">
                <Card.Header className="bg-transparent">
                  <p className="text-uppercase mb-1 fs-12 text-secondary">Performance</p>
                  <h6 className="mb-0">Produk Terjual</h6>
                </Card.Header>
                <Card.Body>
                  <div className="h-350 position-relative">
                    <SoldProductChart />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>

        <div className="dashboard-container">
          <Row gutter={[16, 16]}>

            <Col lg={12} md={12} sm={12} xs={24}>
              <Card className="shadow-sm border-0 bor-rad-5px">
                <Card.Header className="bg-transparent p-t-20 p-b-20">
                  <h6 className="mb-0">Produk Terlaris</h6>
                </Card.Header>
                <Card.Body>
                  <div className="h-350">
                    <Table 
                      dataSource={dataSourceBestProduct} 
                      columns={columnsBestProduct} 
                      pagination={false} 
                      scroll={{ x: 500, y: 350 - 50 }} 
                      size="middle" 
                      className="mt-0" 
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={12} md={12} sm={12} xs={24}>
              <Card className="shadow-sm border-0 bor-rad-5px">
                <Card.Header className="bg-transparent p-t-20 p-b-20">
                  <h6 className="mb-0">Ulasan Baru</h6>
                </Card.Header>
                <Card.Body>
                  <div className="h-350">
                    <Table 
                      dataSource={dataSourceReview} 
                      columns={columnsReviewDashboard}
                      pagination={false} 
                      scroll={{ x: 500, y: 350 - 50 }} 
                      size="middle" 
                      className="mt-0" 
                      rowClassName="va-top hover-pointer"
                      onRow={(record) => {
                        return {
                          onClick: () => onClickReviewRow(record)
                        }
                      }}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </div>
      </section>

      <ModalDetailReview 
        show={showDetailReview}
        close={onCloseModalDetailReview}
        submit={onCloseModalDetailReview}
        data={contentReview}
      />

      <style jsx>{`
        @media(max-width: 767px) {
          :global(.dashboard-section){
            padding: 20px;
          }
        }
        .dashboard-container:not(:last-of-type){
          margin-bottom: 20px;
        }
        .h-350{
          height: 350px;
        }
      `}</style>
    </>
  )
}

Dashboard.whyDidYouRender = true;

export default withAuth(Dashboard)
