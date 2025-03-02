import React from "react";

class SimpleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [
        { "": "N-N", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "N-W", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "S-S", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "S-E", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "E-E", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "E-N", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "W-W", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
        { "": "W-S", "inter_a": "", "inter_b": "", "inter_c": "", "inter_d": "" },
      ],
    };
  }

  render() {
    return (
      <div className="flex justify-center items-center h-[65vh] w-full">
        <Table data={this.state.cars} />
      </div>
    );
  }
}

class Table extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const tableHeads = Object.keys(this.props?.data[0]).filter(key => key !== "");

    return (
      <table className="w-[93%] table-auto border-collapse border-t-2 border-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left border-b-2 border-l-2 border-r-2 border-gray-400">Position</th>
            {tableHeads.map((tableHead, i) => (
              <th key={i} className="px-4 py-2 text-left border-b-2 border-r-2 border-gray-400">
                {tableHead}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props?.data?.map((value, key) => (
            <tr key={key}>
              <td className="px-4 py-2 border-b border-r border-l border-gray-200">{value[""]}</td>
              {tableHeads.map((head, idx) => (
                <td key={idx} className="px-4 py-2 border-b border-r border-gray-200">
                  {value[head] || " "}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default SimpleTable;
