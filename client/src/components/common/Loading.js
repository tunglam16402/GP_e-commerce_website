// import React, { memo } from 'react';
// import { HashLoader } from 'react-spinners';

// const Loading = () => {
//     return <HashLoader color="#ee3131"></HashLoader>;
// };

// export default memo(Loading);
import React, { memo } from 'react';
import { HashLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className="fixed inset-0 bg-overlay  flex items-center justify-center z-[99]">
            <HashLoader color="#ee3131" size={80} />
        </div>
    );
};

export default memo(Loading);
