import { Card } from "@agensy/components";

const MedicareComparisonTable = () => {
  return (
    <Card title="TRADITIONAL MEDICINE VS MEDICARE ADVANTAGE PLANS" className="mt-6">
      <div className="overflow-x-auto ">
        <table className="w-full text-sm text-center text-gray-700 border-collapse border-2 border-black">
          <thead className="text-xs text-gray-800 uppercase  border-b-2 border-black">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 border-r-2 border-black"
              ></th>
              <th scope="col" className="px-6 py-3 border-r-2 border-black">
                Traditional Medicare
              </th>
              <th scope="col" className="px-6 py-3 border-r-2 border-black">
                Medicare Advantage PPO
              </th>
              <th scope="col" className="px-6 py-3 border-r-0 border-black">
                Medicare Advantage HMO
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryColor ">
            <tr className=" border-b-2 border-black hover:bg-gray-50">
              <td
                scope="row"
                className="px-6 py-4 border-r-2 border-black text-black "
              >
                Premium Cost
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                Part B premium
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                Part B premium and plan premium
              </td>
              <td className="px-6 py-4 ">Part B premium and plan premium</td>
            </tr>
            <tr className=" border-b-2 border-black hover:bg-gray-100">
              <td
                scope="row"
                className="px-6 py-4 border-r-2 border-black text-black "
              >
                Prescription Drug Plan
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                Not included
              </td>
              <td className="px-6 py-4 border-r-2 border-black">Included</td>
              <td className="px-6 py-4 ">Included</td>
            </tr>
            <tr className="border-b-2 border-black hover:bg-gray-50">
              <td className="px-6 py-4 border-r-2 border-black text-black ">
                Referrals (PCP has to send a referral to a specialist for you to
                be able to schedule an app!)
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                No referrals needed
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                No referrals needed
              </td>
              <td className="px-6 py-4 ">Referrals needed</td>
            </tr>
            <tr className=" border-b-2 border-black hover:bg-gray-100">
              <td className="px-6 py-4 text-black border-r-2 border-black">
                Doctors
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                Can see anyone in the U.S. that accepts Medicare
              </td>
              <td className="px-6 py-4 border-r-2 border-black">
                Restrictions apply – must be in-network and within service area
              </td>
              <td className="px-6 py-4">
                Restrictions apply – must be in-network and within service area
              </td>
            </tr>
            <tr className="border-b-2 border-black hover:bg-gray-50">
              <td className="px-6 py-4 text-black border-r-2 border-black">
                Hospitals
              </td>
              <td className="border-r-2 border-black">
                Can go anywhere in the U.S. that takes Medicare
              </td>
              <td className="border-r-2 border-black">Restrictions apply</td>
              <td className="">Restrictions apply</td>
            </tr>
            <tr className="border-b-2  border-black hover:bg-gray-100">
              <td
                scope="row"
                className="px-6 py-4 text-black border-r-2 border-black"
              >
                Service Area (can I use it out of state if I'm traveling or
                visiting relatives?)
              </td>
              <td className="px-6 py-4 border-r-2 border-black">Nationwide</td>
              <td className="px-6 py-4 border-r-2 border-black">
                May be restricted to particular service areas
              </td>
              <td className="px-6 py-4 ">
                May be restricted to particular service areas
              </td>
            </tr>
            <tr className=" hover:bg-gray-50">
              <td
                scope="row"
                className="px-6 py-4 text-black border-r-2 border-black"
              >
                Out-Of-Pocket Yearly Limit
              </td>
              <td className="px-6 py-4 border-r-2 border-black">No limit</td>
              <td className="px-6 py-4 border-r-2 border-black">Limit</td>
              <td className="px-6 py-4 ">Limit</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MedicareComparisonTable;
