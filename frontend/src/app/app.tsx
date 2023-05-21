/**
 * This component represents the complete MPC Autofill project editor, ready to
 * drop into a page (as the only component). Must be wrapped with a Redux provider.
 */

import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useSelector } from "react-redux";

import { useGetSourcesQuery } from "@/app/api";
import { RootState } from "@/app/store";
import { selectBackendURL } from "@/features/backend/backendSlice";
import { CardGrid } from "@/features/card/cardGrid";
import { CommonCardback } from "@/features/card/commonCardback";
import { Import } from "@/features/import/import";
import { ProjectStatus } from "@/features/project/projectStatus";
import { SearchSettings } from "@/features/searchSettings/searchSettings";
import DisableSSR from "@/features/ui/disableSSR";
import { ViewSettings } from "@/features/viewSettings/viewSettings";

function App() {
  const cardback =
    useSelector((state: RootState) => state.project.cardback) ?? undefined;

  return (
    <Row>
      <Col lg={8} md={8} sm={6} xs={6}>
        <CardGrid />
      </Col>
      <Col lg={4} md={4} sm={6} xs={6} style={{ zIndex: 1 }}>
        <div
          className="sticky-top sticky-offset g-0"
          style={{ position: "sticky" }}
        >
          {/* TODO: the fact that we have to do this for XML generation to work is dumb. fix it!
          XMLs shouldn't constantly recalculate, they should only calculate on-demand; same with decklists. */}
          <DisableSSR>
            <ProjectStatus />
          </DisableSSR>
          <Row className="g-0">
            <ViewSettings />
          </Row>
          <Row className="g-0 py-3">
            <Col lg={6} md={12} sm={12} xs={12}>
              <SearchSettings />
            </Col>
            <Col lg={6} md={12} sm={12} xs={12}>
              <Import />
            </Col>
          </Row>
          <Col className="g-0" lg={{ span: 8, offset: 2 }} md={12}>
            <CommonCardback selectedImage={cardback} />
          </Col>
        </div>
      </Col>
    </Row>
  );
}

export default App;
