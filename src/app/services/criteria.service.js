const criteriaSortOrder = [
  '170.315 (a)(1)',
  '170.315 (a)(2)',
  '170.315 (a)(3)',
  '170.315 (a)(4)',
  '170.315 (a)(5)',
  '170.315 (a)(6)',
  '170.315 (a)(6)',
  '170.315 (a)(7)',
  '170.315 (a)(7)',
  '170.315 (a)(8)',
  '170.315 (a)(8)',
  '170.315 (a)(9)',
  '170.315 (a)(10)',
  '170.315 (a)(11)',
  '170.315 (a)(11)',
  '170.315 (a)(12)',
  '170.315 (a)(13)',
  '170.315 (a)(14)',
  '170.315 (a)(15)',
  '170.315 (b)(1)',
  '170.315 (b)(2)',
  '170.315 (b)(3)',
  '170.315 (b)(4)',
  '170.315 (b)(4)',
  '170.315 (b)(5)',
  '170.315 (b)(5)',
  '170.315 (b)(6)',
  '170.315 (b)(7)',
  '170.315 (b)(8)',
  '170.315 (b)(9)',
  '170.315 (b)(10)',
  '170.315 (c)(1)',
  '170.315 (c)(2)',
  '170.315 (c)(3)',
  '170.315 (c)(4)',
  '170.315 (d)(1)',
  '170.315 (d)(2)',
  '170.315 (d)(3)',
  '170.315 (d)(4)',
  '170.315 (d)(5)',
  '170.315 (d)(6)',
  '170.315 (d)(7)',
  '170.315 (d)(8)',
  '170.315 (d)(9)',
  '170.315 (d)(10)',
  '170.315 (d)(11)',
  '170.315 (d)(12)',
  '170.315 (d)(13)',
  '170.315 (e)(1)',
  '170.315 (e)(2)',
  '170.315 (e)(3)',
  '170.315 (f)(1)',
  '170.315 (f)(2)',
  '170.315 (f)(3)',
  '170.315 (f)(4)',
  '170.315 (f)(5)',
  '170.315 (f)(6)',
  '170.315 (f)(7)',
  '170.315 (g)(1)',
  '170.315 (g)(2)',
  '170.315 (g)(3)',
  '170.315 (g)(4)',
  '170.315 (g)(5)',
  '170.315 (g)(6)',
  '170.315 (g)(7)',
  '170.315 (g)(8)',
  '170.315 (g)(9)',
  '170.315 (g)(10)',
  '170.315 (h)(1)',
  '170.315 (h)(2)',
  '170.314 (a)(1)',
  '170.314 (a)(2)',
  '170.314 (a)(3)',
  '170.314 (a)(4)',
  '170.314 (a)(5)',
  '170.314 (a)(6)',
  '170.314 (a)(7)',
  '170.314 (a)(8)',
  '170.314 (a)(9)',
  '170.314 (a)(10)',
  '170.314 (a)(11)',
  '170.314 (a)(12)',
  '170.314 (a)(13)',
  '170.314 (a)(14)',
  '170.314 (a)(15)',
  '170.314 (a)(16)',
  '170.314 (a)(17)',
  '170.314 (a)(18)',
  '170.314 (a)(19)',
  '170.314 (a)(20)',
  '170.314 (b)(1)',
  '170.314 (b)(2)',
  '170.314 (b)(3)',
  '170.314 (b)(4)',
  '170.314 (b)(5)(A)',
  '170.314 (b)(5)(B)',
  '170.314 (b)(6)',
  '170.314 (b)(7)',
  '170.314 (b)(8)',
  '170.314 (b)(9)',
  '170.314 (c)(1)',
  '170.314 (c)(2)',
  '170.314 (c)(3)',
  '170.314 (d)(1)',
  '170.314 (d)(2)',
  '170.314 (d)(3)',
  '170.314 (d)(4)',
  '170.314 (d)(5)',
  '170.314 (d)(6)',
  '170.314 (d)(7)',
  '170.314 (d)(8)',
  '170.314 (d)(9)',
  '170.314 (e)(1)',
  '170.314 (e)(2)',
  '170.314 (e)(3)',
  '170.314 (f)(1)',
  '170.314 (f)(2)',
  '170.314 (f)(3)',
  '170.314 (f)(4)',
  '170.314 (f)(5)',
  '170.314 (f)(6)',
  '170.314 (f)(7)',
  '170.314 (g)(1)',
  '170.314 (g)(2)',
  '170.314 (g)(3)',
  '170.314 (g)(4)',
  '170.314 (h)(1)',
  '170.314 (h)(2)',
  '170.314 (h)(3)',
  '170.302 (a)',
  '170.302 (b)',
  '170.302 (c)',
  '170.302 (d)',
  '170.302 (e)',
  '170.302 (f)(1)',
  '170.302 (f)(2)',
  '170.302 (f)(3)',
  '170.302 (g)',
  '170.302 (h)',
  '170.302 (i)',
  '170.302 (j)',
  '170.302 (k)',
  '170.302 (l)',
  '170.302 (m)',
  '170.302 (n)',
  '170.302 (o)',
  '170.302 (p)',
  '170.302 (q)',
  '170.302 (r)',
  '170.302 (s)',
  '170.302 (t)',
  '170.302 (u)',
  '170.302 (v)',
  '170.302 (w)',
  '170.304 (a)',
  '170.304 (b)',
  '170.304 (c)',
  '170.304 (d)',
  '170.304 (e)',
  '170.304 (f)',
  '170.304 (g)',
  '170.304 (h)',
  '170.304 (i)',
  '170.304 (j)',
  '170.306 (a)',
  '170.306 (b)',
  '170.306 (c)',
  '170.306 (d)(1)',
  '170.306 (d)(2)',
  '170.306 (e)',
  '170.306 (f)',
  '170.306 (g)',
  '170.306 (h)',
  '170.306 (i)',
];

const sortCriteria = (a, b) => {
  const aValue = a.number ?? a.certificationNumber;
  const bValue = b.number ?? b.certificationNumber;
  return criteriaSortOrder.indexOf(aValue) - criteriaSortOrder.indexOf(bValue);
};

export {
  sortCriteria,
};
