import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import { useVirtual } from 'react-virtual';

function App() {
  const cells = new Array(10).fill(true).map(() =>
    new Array(10).fill(true).map(() => ({
      height: 25 + Math.round(Math.random() * 100),
      width: 75 + Math.round(Math.random() * 100),
    }))
  );

  return (
    <div>
      <h3>Grid</h3>
      <GridVirtualizerDynamic cells={cells} />
    </div>
  );
}

function GridVirtualizerDynamic({ cells }) {
  const parentRef = React.useRef();

  const rowVirtualizer = useVirtual({
    size: cells.length,
    parentRef,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: cells[0].length,
    parentRef,
  });

  const [show, setShow] = React.useState(true);

  const halfWay = Math.floor(cells.length / 2);

  return (
    <>
      <button onClick={() => setShow((old) => !old)}>Toggle</button>
      <button onClick={() => rowVirtualizer.scrollToIndex(halfWay)}>
        Scroll to index {halfWay}
      </button>
      <button onClick={() => rowVirtualizer.scrollToIndex(cells.length - 1)}>
        Scroll to index {cells.length - 1}
      </button>
      {show ? (
        <div
          ref={parentRef}
          className="List"
          style={{
            height: `400px`,
            width: `500px`,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: rowVirtualizer.totalSize,
              width: columnVirtualizer.totalSize,
              position: 'relative',
            }}
          >
            {rowVirtualizer.virtualItems.map((virtualRow) => (
              <React.Fragment key={virtualRow.key}>
                {columnVirtualizer.virtualItems.map((virtualColumn) => (
                  <div
                    key={virtualColumn.key}
                    ref={(el) => {
                      virtualRow.measureRef(el);
                      virtualColumn.measureRef(el);
                    }}
                    className={
                      virtualColumn.index % 2
                        ? virtualRow.index % 2 === 0
                          ? 'ListItemOdd'
                          : 'ListItemEven'
                        : virtualRow.index % 2
                        ? 'ListItemOdd'
                        : 'ListItemEven'
                    }
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div
                      style={{
                        ...cells[virtualRow.index][virtualColumn.index],
                      }}
                    >
                      Cell {virtualRow.index}, {virtualColumn.index}
                      <br />
                      {JSON.stringify(
                        cells[virtualRow.index][virtualColumn.index]
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : null}
      <br />
      <br />›
      {process.env.NODE_ENV === 'development' ? (
        <p>
          <strong>Notice:</strong> You are currently running React in
          development mode. Rendering performance will be slightly degraded
          until this application is build for production.
        </p>
      ) : null}
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
