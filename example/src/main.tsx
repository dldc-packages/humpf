import './style.css';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { SpringSequenceFn } from '@humpf';
import { SpringCanvas } from './components/SpringCanvas';
import { CodeBlock } from './components/CodeBlock';
// examples
import basic_content from './examples/basic?raw';
import basic_spring from './examples/basic';
import config_content from './examples/config?raw';
import config_spring from './examples/config';
import bounce_content from './examples/bounce?raw';
import bounce_spring from './examples/bounce';
import negative_content from './examples/negative?raw';
import negative_spring from './examples/negative';
import sequence01_content from './examples/sequence01?raw';
import sequence01_spring from './examples/sequence01';
import sequence02_content from './examples/sequence02?raw';
import sequence02_spring from './examples/sequence02';
import sequence03_content from './examples/sequence03?raw';
import sequence03_spring from './examples/sequence03';
import sequence04_content from './examples/sequence04?raw';
import sequence04_spring from './examples/sequence04';
import sequence05_content from './examples/sequence05?raw';
import sequence05_spring from './examples/sequence05';
import sequence06_content from './examples/sequence06?raw';
import sequence06_spring from './examples/sequence06';

ReactDOM.render(<App />, document.getElementById('app'));

function App(): JSX.Element {
  return (
    <div>
      <Example title="Basic" code={basic_content} spring={basic_spring} />
      <Example title="Config" code={config_content} spring={config_spring} />
      <Example
        title="Bounce"
        code={bounce_content}
        spring={bounce_spring}
        xMax={3000}
        yMax={160}
        horizontalLines={[100]}
      />
      <Example
        title="Negative Time"
        code={negative_content}
        spring={negative_spring}
        xMin={-500}
        xMax={3000}
        yMin={0}
        yMax={200}
        verticalLines={[0]}
        horizontalLines={[100]}
      />
      <Example
        title="Sequence"
        code={sequence01_content}
        spring={sequence01_spring}
        xMax={3000}
        yMax={100}
        verticalLines={[0, 800]}
      />
      <Example
        title="Sequence 2"
        code={sequence02_content}
        spring={sequence02_spring}
        xMax={3000}
        yMax={100}
        verticalLines={[0, 500]}
      />
      <Example
        title="Sequence 3"
        code={sequence03_content}
        spring={sequence03_spring}
        xMin={-200}
        xMax={7000}
        yMax={170}
        yMin={-170}
        verticalLines={[0, 500, 1000, 3000, 3500, 4000]}
        horizontalLines={[-100, 0, 100]}
      />
      <Example
        title="Sequence 4"
        code={sequence04_content}
        spring={sequence04_spring}
        xMin={-500}
        xMax={6000}
        yMin={450}
        yMax={-50}
        verticalLines={[0, 1000, 2000, 3000]}
        horizontalLines={[0, 100, 200, 300, 400]}
      />
      <Example
        title="Sequence 5"
        code={sequence05_content}
        spring={sequence05_spring}
        xMin={-500}
        xMax={4500}
        yMin={450}
        yMax={-50}
        verticalLines={[0, 1000, 2000, 3000]}
        horizontalLines={[0, 100, 200, 300, 400]}
      />
      <Example
        title="Sequence 6"
        code={sequence06_content}
        spring={sequence06_spring}
        xMin={-500}
        xMax={3000}
        yMin={0}
        yMax={200}
        verticalLines={[0]}
        horizontalLines={[100]}
      />
    </div>
  );
}

type ExampleProps = {
  title: string;
  code: string;
  spring: SpringSequenceFn;

  loop?: boolean;
  ratio?: number;
  yMin?: number;
  yMax?: number;
  xMin?: number;
  xMax?: number;
  restartOnChange?: boolean;
  restartOnChangeDebounce?: number | false;
  autoStart?: boolean;
  autoStartDelay?: number;
  horizontalLines?: Array<number>;
  verticalLines?: Array<number>;
};

function Example({ code, spring, title, ...other }: ExampleProps): JSX.Element {
  const codeFixed = useMemo(
    () => '\n' + code.replace(/@humpf/g, 'humpf').replace(/export default/g, 'const spring ='),
    [code]
  );

  return (
    <div>
      <h2>{title}</h2>
      <CodeBlock code={codeFixed} />
      <SpringCanvas spring={spring} {...other} />
    </div>
  );
}
