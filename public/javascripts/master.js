/*
{
    table: 'employee',
    attribute: ['eid', 'ename', 'city'],
    content: [
      {
        ['e00', 'Amy', 'Vestal'],
        ['e01', 'Amy', 'Vestal'],
        ['e02', 'Amy', 'Vestal'],
        ['e03', 'Amy', 'Vestal'],
        ['e04', 'Amy', 'Vestal']
      }
    ]
}
*/
var now_table_info;
let tables = [
  'customers',
  'employees',
  'logs',
  'products',
  'purchases',
  'suppliers'
];
let width;
let isDel = false;
function whichChild(child, n){
  for(let i=0;i<child.length;i++){
    if ( child[i]== n) return i;
  }
  return null;
}
function alerError(r){
  notice_it(r['message']);
}
function updateTableInfo(info, that){
  let xhr = new XMLHttpRequest();
  xhr.onload = function(){
    let r = JSON.parse(xhr.response);
    if(r['status'] == 'success'){
      notice_it("更新成功！");
      that.innerHTML = info['aim'];
    } else if(r['status'] == 'error'){
      alerError(r['code']);
    }
  }
  xhr.open('POST', '/update');
  xhr.send(JSON.stringify(info));
}
function getTableInfo(index){
  let card = $(".card");
  card.remove();
  let xhr = new XMLHttpRequest();
  xhr.onload = function(){
    let table_info = JSON.parse(xhr.response);
    now_table_info = table_info;
    init_table(table_info, index);
    table_register();
  }
  xhr.open('GET', '/get/'+index);
  xhr.send();
}
function init_table(table_info, index){
  let title = create_element('div', 'card_title', 'table name: ' + table_info['table']);
  let content = create_element('div', 'card_content', '');
  let table = create_element('div', 'card_table', '');
  let head = create_element('div', 'card_thead card_tr', '');
  head = append_head(head, table_info['attribute']);
  table.appendChild(head);
  table = append_table(table, table_info['content']);
  content.appendChild(table);
  let card = create_element('div', 'card', '');
  card_id = "card_" + index;
  card.id += card_id;
  let hr = document.createElement('hr');
  card.appendChild(title);
  card.appendChild(hr);
  card.appendChild(content);
  let container = document.getElementsByClassName('container')[0];
  container.appendChild(card);
  let attrCount = table_info['attribute'].length;
  let th_all = card.getElementsByClassName("th");
  let td_all = card.getElementsByClassName("td");
  width = 90/attrCount + "%";
  for(let i=0;i<th_all.length;i++){
    th_all[i].style.width = width;
  }
  for(let i=0;i<td_all.length;i++){
    td_all[i].style.width = width;
  }
}

function create_element(e, c, t){
  let ele = document.createElement(e);
  ele.className += c;
  let text = document.createTextNode(t);
  ele.appendChild(text);
  return ele;
}

function append_head(head, attr){
  attr.forEach(function(v, i){
    let th = create_element('div', 'th', v);
    head.appendChild(th);
  });
  return head;
}
function adder_register(){
  $(".adder_submit").on('click', function(){
    let nowt = tables.indexOf(now_table_info['table']);
    let d = {
      'nowt': nowt,
      'data': get_data()
    };
    add_info(d);
  });
}
function table_register(){
  $(".td").on('click', function(){
    if(isDel){
      let child = this.parentElement.children;
      let nid = this.parentElement.children[0].innerHTML;
      let nowt = Number(this.parentElement.parentElement.parentElement.parentElement.id[5]);
      let info = {
        'nowt': nowt,
        'nid': nid
      }
      del_info(info, this.parentElement);
      isDel = false;
    } else {
      notice_it("请输入要修改的内容。");
      let child = this.parentElement.children;
      console.log(child);
      let v = this.innerHTML;
      let indexof = whichChild(child, this);
      let c = prompt("修改：", v);
      if(c!=null){
        if(c!=v){
          let nid = this.parentElement.children[0].innerHTML;
          let nowt = Number(this.parentElement.parentElement.parentElement.parentElement.id[5]);
          console.log(nowt);
          let info = {
            'aim': c,
            'pos': indexof,
            'nid': nid,
            'nowt': nowt
          }
          updateTableInfo(info, this);
        }
      }
    }
  })
}
function create_input(label_name){
  let lab = document.createElement('label');
  lab.innerHTML = label_name;
  lab.htmlFor = label_name;
  let inp = document.createElement('input');
  inp.name = label_name;
  inp.id = label_name;
  let d = document.createElement('div');
  d.className += "input_place";
  d.appendChild(lab);
  d.appendChild(inp);
  return d;
}
function init_adder(){
  let adder = create_element('div', 'adder', '');
  now_table_info['attribute'].forEach(function(v, i){
    adder.appendChild(create_input(v));
  });
  let butt = create_element('button', 'adder_submit', '添加');
  adder.appendChild(butt);
  let container = document.getElementsByClassName('container')[0];
  container.appendChild(adder);
  adder_register();
}
function get_data(){
  let data = {};
  $.each($('.input_place input'), function(i, v, a){
    let va = $(v).val();
    if (va) {
      data[now_table_info['attribute'][i]] = va;
    }
  })
  return data;
}
function add_line(data){
  let t = document.getElementsByClassName("card_table")[0];
  let ct = create_element('div', 'card_tr', '');
  now_table_info['attribute'].forEach(function(v, i){
    let d = create_element('div', 'td', data[v]);
    d.style.width = width;
    ct.appendChild(d);
  });
  t.appendChild(ct);
}
function add_info(info){
  let xhr = new XMLHttpRequest();
  xhr.onload = function(){
    let r = JSON.parse(xhr.response);
    if(r['status'] == 'success'){
      notice_it("更新成功！");
      add_line(info['data']);
      $(".adder").remove();
      table_register();
    } else if(r['status'] == 'error'){
      alerError(r);
    }
  }
  xhr.open('POST', '/add');
  xhr.send(JSON.stringify(info));
}
function append_table(table, con){
  con.forEach(function(v, i){
    let tr = create_element('div', 'card_tr', '');
    v.forEach(function(va, inn){
      let td = create_element('div', 'td', va);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  })
  return table;
}
function notice_it(msg){
  let n = "通知：";
  $("#notice").html(n+msg);
}
function del_info(info, p){
  let xhr = new XMLHttpRequest();
  xhr.onload = function(){
    let r = JSON.parse(xhr.response);
    if(r['status'] == 'success'){
      notice_it("删除成功！");
      p.remove();
    } else if(r['status'] == 'error'){
      alerError(r);
    }
  }
  xhr.open('POST', '/del');
  xhr.send(JSON.stringify(info));
}
function cul_date(sd, ed){
  let d = ed.getTime() - sd.getTime();
  let day = Math.floor(d/(24*3600*1000));
  return day;
}
$(document).ready(function(){
  getTableInfo(0);
  $(".table_sele").change(function(){
    isDel = false;
    notice_it("切换表格！");
    $(".adder").remove();
    let now = Number($(this).children('option:selected').val())-1;
    getTableInfo(now);
  });
  $(".butt_add").on('click', function(){
    notice_it("请在下方输入需要添加的内容。");
    $(".adder").remove();
    init_adder();
  });
  $(".butt_del").on('click', function(){
    notice_it("请选择你要删除的行!");
    isDel = true;
  });
  $("#time").html("距离寒假还差" + cul_date(new Date(), new Date("2018-01-19")) + "天");
});
