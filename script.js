(function(){
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('button');
  let expression = '';
  let lastOperation = null; // 마지막 연산 저장

  function updateDisplay(){ display.textContent = expression || '0'; }

  function safeEval(raw){
    try{
      let expr = raw.replace(/÷/g,'/').replace(/×/g,'*').replace(/−/g,'-');
      expr = expr.replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
      const fn = new Function('return ('+expr+')');
      const val = fn();
      if(val===Infinity||val===-Infinity||Number.isNaN(val)) throw new Error();
      return Math.round((val+Number.EPSILON)*1e12)/1e12;
    }catch(e){return '오류'}
  }

  buttons.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const val = btn.dataset.value;
      const act = btn.dataset.action;

      if(act==='clear'){
        expression='';
        lastOperation=null;
        updateDisplay();
        return;
      }
      if(act==='back'){
        expression=expression.slice(0,-1);
        updateDisplay();
        return;
      }
      if(act==='equals'){
        if(expression){
          let res = safeEval(expression);
          display.textContent=res;
          // 마지막 연산 추출 (숫자 + 연산자 + 숫자 꼴)
          const match = expression.match(/([\d.]+)([+\-*/%])([\d.]+)$/);
          if(match){
            lastOperation = match[2]+match[3];
          }
          expression=String(res);
        } else if(lastOperation){
          // expression이 없고 마지막 연산이 있을 때 반복
          expression = display.textContent + lastOperation;
          let res = safeEval(expression);
          display.textContent=res;
          expression=String(res);
        }
        return;
      }

      if(val){
        expression += val;
        updateDisplay();
        return;
      }
    });
  });

  updateDisplay();
})();